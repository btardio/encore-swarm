#!/bin/bash
#
# NOTE: allowed_hosts has two hosts, it worked with one host
#
# ------------------------------------------------------------------
# [Author] Title
#          Description
# ------------------------------------------------------------------

VERSION=0.1.0
SUBJECT=some-unique-id
USAGE=$(printf "Usage: 
			 \t -p <address of httpd server that proxies request>
                         \t -m <address of swarm manager>
                         \t -s <suffix of docker hub image> 
			 \t -l <solr server>")



# --- Options processing -------------------------------------------
if [ $# == 0 ] ; then
    printf '%s\n' "$USAGE"
    exit 1;
fi

while getopts ":l:p:m:s:vh" optname
  do
    case "$optname" in
      "v")
        echo "Version $VERSION"
        exit 0;
        ;;
      "p")
        echo "-p argument: $OPTARG"
	proxy=$OPTARG
        ;;
      "m")
        echo "-m argument: $OPTARG"
        manager=$OPTARG
        ;;
      "s")
        echo "-s argument: $OPTARG"
	SUFFIX=$OPTARG
	;;
      "l")
        echo "-l argument: $OPTARG"
        solr=$OPTARG
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

echo "IP: $IP"
echo "SUFFIX: $SUFFIX"


sudo yum install python3-pip -y
sudo pip3 install django
sudo pip3 install django-cors-headers
mkdir dockerstartup
cd dockerstartup
git clone https://github.com/btardio/encore-uwsgi.git
mv encore-uwsgi encorea
git clone https://github.com/btardio/encore-swarm.git

mkdir /home/ec2-user/dockerstartup/encore-swarm/nginx/static
sudo mount --bind /home/ec2-user/dockerstartup/encorea/static ./encore-swarm/nginx/static
# sudo docker build ./encore-swarm/nginx/

mkdir /home/ec2-user/dockerstartup/encore-swarm/uwsgi/encorea
sudo mount --bind /home/ec2-user/dockerstartup/encorea ./encore-swarm/uwsgi/encorea
# sudo docker build ./encore-swarm/uwsgi/

python3 ./encorea/manage.py collectstatic --noinput

if [ ! -f ./encorea/encorea/settings.py.backup ]; then
    cp ./encorea/encorea/settings.py ./encorea/encorea/settings.py.backup
fi

sed "s/SOLR_SERVERS = ['172.31.12.20']/SOLR_SERVERS =['${solr}']/g" ./encorea/encorea/settings.py.backup > ./encorea/encorea/settings.py

sed -i "s/172.31.12.20/${proxy}','${manager}/g" ./encorea/encorea/settings.py
#.backup > ./encorea/encorea/settings.py

sed -i "s/SWARM = False/SWARM = True/g" ./encorea/encorea/settings.py
sed -i "s/DEBUG = True/DEBUG = False/g" ./encorea/encorea/settings.py

# sudo docker build ./encore-swarm/uwsgi/ | grep Success | sed "s/Successfully built //g"

IP=$proxy

sh ../nginxdeploy.sh -i $IP -s $SUFFIX
sh ../uwsgideploy.sh -i $IP -s $SUFFIX
sh ../zookeeperdeploy.sh -i $IP -s $SUFFIX

sudo umount /home/ec2-user/dockerstartup/encore-swarm/uwsgi/encorea
sudo umount /home/ec2-user/dockerstartup/encore-swarm/nginx/static


