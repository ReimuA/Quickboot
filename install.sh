npm ci

sudo ln -sf $PWD/autocomplete.sh /etc/bash_completion.d/qb

mkdir -p $HOME/bin >/dev/null 2>$1 # Create bin directory if it doesn't exist

ln -sf $PWD/quickboot.js $HOME/bin/bootProject

cat << 'EOF'
# Please add in your ~/.zshrc:

export WORKSPACE_DIR=/home/dev/Projects

autoload bashcompinit
bashcompinit
source /etc/bash_completion.d/qb

qb() {
    bootProject $1
    cd $WORKSPACE_DIR/$1
}

# Make sure $HOME/bin is in the path

EOF

