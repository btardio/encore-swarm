FROM httpd:2.4
COPY ./httpd.conf /usr/local/apache2/conf/httpd.conf
#RUN groupadd -r apache && useradd -r --create-home -g apache apache
RUN touch /.htpasswd
RUN echo 'encore:$apr1$VzPnS5GA$oDpQ5K/lUfCIvSsLOM9Ta.' > /.htpasswd
