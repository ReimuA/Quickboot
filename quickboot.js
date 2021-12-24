#!node

let { exec, spawn, execSync } = require("child_process");
let { existsSync, readFileSync } = require('fs');
let YAML = require('yaml')
const chalk = require("chalk");

function listServicesPath(dockerComposeFilePath) {
    const content = readFileSync(`${dockerComposeFilePath}/docker-compose.yml`, 'utf8')
    const compose = YAML.parse(content)

    // find relative directories from base path for each container
    const servicesPath = Object.values(compose["services"])
        .map(x => x["working_dir"])
        .filter(x => x != undefined)
        .map(s => s.split("/").slice(-1)[0])

    return servicesPath
}

function buildVsCodeCommandLine(projectName, services) {
    return services.map(s => `code --remote ssh-remote+dev ${process.env.WORKSPACE_DIR}/${projectName}/${s}`);
}

function buildVsCodeCli(services) {
    return services.map(s => {

    })
}


// Execute synchronously and log the output
function ExecAndLog(command) {
    console.log(`Executing: ${command}`);

    return new Promise((resolve, reject) => {
        let child = spawn(command, { shell: true });

        child.stdout.on('data', (data) => process.stdout.write(`${data}`));

        child.stderr.on('data', (data) => process.stderr.write(`${data}`));

        child.on('close', (code) => {

            if (code !== 0) {
                reject(`Command ${command} exited with code ${code}`);
            }
            resolve(code);
        });
    });
}

function KillContainer(ids) {
    return ids.length > 0 ? ExecAndLog(`docker kill ${ids.join(' ')}`) : Promise.resolve();
}

if (process.argv.length < 3) {
    console.log("bleh")
    return 1;
}

let projectName = process.argv[2];

let paths = [
    `${process.env.WORKSPACE_DIR}/${projectName}/docker/${projectName}`,
    `${process.env.WORKSPACE_DIR}/${projectName}/Docker/${projectName}`
];

let path = paths.find(x => existsSync(x));

if (path == undefined) {
    console.log("Project / Docker configuration not found");
    console.log("Path looked:");
    console.log(paths);
    return 1;
}

process.chdir(path);

let ids = execSync("docker ps -q").toString().split("\n").filter(x => x.length > 0);

KillContainer(ids)
    .then(_ => ExecAndLog("docker-compose up -d"));

const servicesPath = listServicesPath(path)
const cli = buildVsCodeCommandLine(projectName, servicesPath)

console.log(cli.map(x => chalk.green(x)).join("\n"));
