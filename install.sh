sudo ln -sf $PWD/autocomplete.sh /etc/bash_completion.d/qb
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

