#!/bin/bash
# ------------------------------------------------------------------
# [Author] Title
#          Description
# ------------------------------------------------------------------

VERSION=0.1.0
SUBJECT=some-unique-id
USAGE=$(printf "Usage: \n\t -i <address of httpd server that proxies request> \n\t -s <suffix of docker hub image> ")



# --- Options processing -------------------------------------------
if [ $# == 0 ] ; then
    printf '%s\n' "$USAGE"
    exit 1;
fi

while getopts ":i:s:vh" optname
  do
    case "$optname" in
      "v")
        echo "Version $VERSION"
        exit 0;
        ;;
      "i")
        echo "-i argument: $OPTARG"
	ip=$OPTARG
        ;;
      "s")
        echo "-s argument: $OPTARG"
	suffix=$OPTARG
	;;
      "h")
        printf '<%s>' "$USAGE"
        exit 0;
        ;;
      "?")
        echo "Unknown option $OPTARG"
        exit 0;
        ;;
      ":")
        echo "No argument value for option $OPTARG"
        exit 0;
        ;;
      *)
        echo "Unknown error while processing options"
        exit 0;
        ;;
    esac
  done


export DOCKER_ID_USER="btardio"

sudo docker login

currentdate=$(date +"%m%d%Y")


idnginx=$(exec sudo docker build ./encore-swarm/nginx/ | grep Success | sed "s/Successfully built //g")

## if dev

sudo docker tag $idnginx btardio/nginx-dev$suffix:$currentdate
sudo docker push btardio/nginx-dev$suffix:$currentdate


if [ ! -f ./encore-swarm/nginx/docker-compose.yml.backup ]; then
    cp ./encore-swarm/nginx/docker-compose.yml ./encore-swarm/nginx/docker-compose.yml.backup
fi

# cp ./encore-swarm/nginx/docker-compose.yml ./encore-swarm/nginx/docker-compose.yml.backup

## if dev
sed "s/btardio\/nginx/btardio\/nginx-dev${suffix}:${currentdate}/g" ./encore-swarm/nginx/docker-compose.yml.backup > ./encore-swarm/nginx/docker-compose.yml

sudo docker stack deploy --compose-file=./encore-swarm/nginx/docker-compose.yml nginx



