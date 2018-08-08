#!/bin/bash
# ------------------------------------------------------------------
# [Author] Title
#          Description
# ------------------------------------------------------------------

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

iduwsgi=$(exec sudo docker build ./encore-swarm/uwsgi/ | grep Success | sed "s/Successfully built //g")

echo $iduwsgi

sudo docker tag $iduwsgi btardio/uwsgi-dev$suffix:$currentdate
sudo docker push btardio/uwsgi-dev$suffix:$currentdate

if [ ! -f ./encore-swarm/uwsgi/docker-compose.yml.backup ]; then
    cp ./encore-swarm/uwsgi/docker-compose.yml ./encore-swarm/uwsgi/docker-compose.yml.backup
fi

## if dev
sed "s/btardio\/uwsgi/btardio\/uwsgi-dev${suffix}:${currentdate}/g" ./encore-swarm/uwsgi/docker-compose.yml.backup > ./encore-swarm/uwsgi/docker-compose.yml

sudo docker stack deploy --compose-file=./encore-swarm/uwsgi/docker-compose.yml uwsgi




