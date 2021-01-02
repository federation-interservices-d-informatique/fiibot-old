#!/usr/bin/env bash
function Install-NodeModules {
    npm install 
    if [[ $? != 0 ]]; then
        echo "Erreur lors de l'installation des modules!"
        exit 1    
    fi
}

NAME="fiibot"
if [[ "ps -ef | grep -i ${NAME} | grep -v grep" ]]; then
    pm2 stop "${NAME}"
fi
PSUM="$(sha256sum package.json)"
if [[ -d ".git" ]]; then
	rm -rf package-lock.log # Cause some conflicts
    git pull
fi
if [[ "${PSUM}" != "$(sha256sum package.json)"  ]]; then
	rm -rf "./node_modules"
fi
if [[ ! -d "./node_modules" ]]; then
    Install-NodeModules
fi
npx tsc
pm2 start --name "${NAME}" --log "${NAME}.log" dist/index.js