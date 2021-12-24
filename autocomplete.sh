_qb() 
{
    local cur prev opts
    COMPREPLY=()
    cur="${COMP_WORDS[COMP_CWORD]}"
    prev="${COMP_WORDS[COMP_CWORD-1]}"
    opts="--help --verbose --version"

    filelist=""

    for file in $WORKSPACE_DIR/* # Modify with your project directory
    do
        filename=${file##*/}
        filelist="${filelist} ${filename}"
    done

        COMPREPLY=( $(compgen -W "${filelist}" -- ${cur}) )
        return 0
}

complete -F _qb qb
