#!/usr/bin/env bash
APP="fiibot"
if [[ ! $(command -v "git") ]]
then
    echo -e "\e[91mYou need to install git!"
    exit 1 
fi
if [[ ! $(command -v "docker") ]]
then
    echo -e "\e[91mYou need to install docker!"
    exit 1
fi
if [[ ! $(command -v "docker-compose") ]]
then
    echo -e "\e[91mYou need to install docker-compose!"
    exit 1
fi
git submodule update --init --recursive --force --remote || exit 1;
echo -e "\e[96mBuilding ${APP}..."
echo ""
SUDO="sudo" 
if [[ $(command -v "doas") ]]
then 
    SUDO="doas" 
fi
if [[ ! $(command -v "${SUDO}") && $UID != "0" ]]; then
    echo -e "\e[91mYou need to install sudo for building!"
fi
$SUDO docker-compose build

echo -e "\e[96mStarting ${APP}..."
echo ""
docker-compose down
docker-compose up -d