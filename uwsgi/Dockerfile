FROM alpine

RUN apk update

RUN apk add python3

RUN apk add uwsgi-python3

RUN pip3 install django

RUN pip3 install requests

RUN apk add uwsgi-http

RUN touch /uwsgi.ini

RUN echo "[uwsgi]" >> /uwsgi.ini
RUN echo "plugin=python3,http" >> /uwsgi.ini
RUN echo "chdir=/encorea/" >> /uwsgi.ini
RUN echo "env DJANGO_SETTINGS_MODULE=djangoproj.settings" >> /uwsgi.ini
RUN echo "master=1" >> /uwsgi.ini
RUN echo "pidfile=/tmp/project-master.pid" >> /uwsgi.ini
RUN echo "http=:80" >> /uwsgi.ini
RUN echo "processes=5" >> /uwsgi.ini
RUN echo "threads=4" >> /uwsgi.ini
RUN echo "harakiri=30" >> /uwsgi.ini
RUN echo "max-requests=5000" >> /uwsgi.ini
RUN echo "vacuum=1" >> /uwsgi.ini
RUN echo "wsgi-file=encorea/wsgi.py" >> /uwsgi.ini
RUN echo "post-buffering=1" >> /uwsgi.ini
# RUN echo "enable-threads=1" >> /uwsgi.ini
# it makes socket anyways so following the django website
RUN echo "socket=127.0.0.1:49152" >> /uwsgi.ini

#RUN mkdir /encorea
#ADD encorea /encorea
#ADD encoreajs.log /


ENV GOSU_VERSION 1.10
RUN apk add dpkg
RUN export dpkgArch="$(dpkg --print-architecture | awk -F- '{ print $NF }')"
RUN wget -O /usr/local/bin/gosu https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$(dpkg --print-architecture | awk -F- '{ print $NF }')
RUN wget -O /usr/local/bin/gosu.asc https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$(dpkg --print-architecture | awk -F- '{ print $NF }').asc
RUN chmod +x /usr/local/bin/gosu
RUN gosu nobody true

RUN setcap 'cap_net_bind_service=+ep' /usr/sbin/uwsgi
RUN adduser -D -H encorea

RUN mkdir /encorea
ADD encorea /encorea
ADD encoreajs.log /

RUN chown -R encorea:encorea encoreajs.log
RUN chown -R encorea:encorea encorea

#ENTRYPOINT ["gosu", "encorea", "uwsgi", "/uwsgi.ini"]


