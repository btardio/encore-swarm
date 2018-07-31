FROM solr:alpine

#ADD solrconfig.xml /tmp/
#ADD managed-schema /tmp/
# removed 4-20-18 #COPY encore /opt/solr/server/solr/configsets
#ADD encore_make_only.csv /

RUN rm -rf /opt/solr/server/solr

#COPY managed-schema /opt/solr/server/solr/configsets/_default/conf/
#COPY solr.xml /opt/solr/server/solr/
COPY ./solr /opt/solr/server/solr

# besides a default managed-schema, which will be overridden by zookeeper
# if the zookeeper version is different, all other commands to start 
# an initial solr cloud are (sensibly) given with API curl after startup 
# of the node - copying directories of collections isn't a great idea?
# todo in future: create a startup script that checks if a collection exists
# if not creates collection from _default configset and then 
# sends the csv file to populate solr
#
# if you wanted very strictly defined cores you could create a 
# core.properties file for each core, but if you added replicas in docker
# swarm it wouldn't work because core.properties are defined for each core


#RUN mkdir /opt/solr/server/solr/configsets/encore
# RUN mkdir /opt/solr/server/solr/configsets/encore/conf

#RUN cp /tmp/solrconfig.xml /opt/solr/server/solr/configsets/encore/conf/
#RUN cp -r /tmp/conf/ /opt/solr/server/solr/configsets/encore/

#ENTRYPOINT [ "/opt/solr/bin/solr" ]
#CMD [ "start -f -c -p 8983 -z 54.183.231.145:2181" ]
