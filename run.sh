#!/usr/bin/env/bash
NAME="fiibot"
if [[ "ps -ef | grep -i ${NAME} | grep -v grep" ]]; then
    pm2 stop "${NAME}"
fi
if [[ ! -d "./node_modules" ]]; then
    npm install --production
    if [[ $? != 0 ]]; then
        echo "Erreur lors de l'installation des modules!"
        exit 1    
    fi
fi
if [[ $1 == "reinstall" ]]; then
    if [[ -d "./node_modules" ]]; then
        rm -rf "./node_modules"
        npm install --production
        if [[ $? != 0 ]]; then
            echo "Erreur lors de l'installation des modules!"
            exit 1    
        fi
    else 
        npm install --production
        if [[ $? != 0 ]]; then
            echo "Erreur lors de l'installation des modules!"
            exit 1    
        fi
    fi
fi
pm2 start --name "${NAME}" --log "${NAME}.log" index.js