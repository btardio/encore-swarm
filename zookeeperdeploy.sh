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


idzk=$(exec sudo docker build ./encore-swarm/zookeeper/ | grep Success | sed "s/Successfully built //g")

## if dev

sudo docker tag $idzk btardio/zk-dev$suffix:$currentdate
sudo docker push btardio/zk-dev$suffix:$currentdate


if [ ! -f ./encore-swarm/zookeeper/docker-compose.yml.backup ]; then
    cp ./encore-swarm/zookeeper/docker-compose.yml ./encore-swarm/zookeeper/docker-compose.yml.backup
fi

# cp ./encore-swarm/zk/docker-compose.yml ./encore-swarm/nginx/docker-compose.yml.backup

## if dev
sed "s/btardio\/zk/btardio\/zk-dev${suffix}:${currentdate}/g" ./encore-swarm/zookeeper/docker-compose.yml.backup > ./encore-swarm/zookeeper/docker-compose.yml

sudo docker stack deploy --compose-file=./encore-swarm/zookeeper/docker-compose.yml zk

sleep 20

curl "http://127.0.0.1:8983/solr/admin/collections?action=CREATE&name=encorea&numShards=1&replicationFactor=1&maxShardsPerNode=1&collection.configName=_default"

curl "http://127.0.0.1:8983/solr/admin/collections?action=CREATE&name=encorel&numShards=1&replicationFactor=1&maxShardsPerNode=1&collection.configName=_default"

curl -X POST -H 'Content-type:application/json' --data-binary '{

  "add-field-type":[
  {
     "name":"encoreNGramTextField",
     "class":"solr.TextField",
     "indexAnalyzer":{

        "tokenizer":{
           "class":"solr.StandardTokenizerFactory" 
        },

        "filters":[
            {
                "class":"solr.LowerCaseFilterFactory"
            },
            {
                "class":"solr.NGramTokenizerFactory",
                "minGramSize":"3",
                "maxGramSize":"100",
            }
        ],
            
     },
     "queryAnalyzer":{
        "tokenizer":{
           "class":"solr.StandardTokenizerFactory" 
        }
        "filters":[
            {
                "class":"solr.LowerCaseFilterFactory"
            },
            {
                "class":"solr.NGramTokenizerFactory",
                "minGramSize":"3",
                "maxGramSize":"100",
            }
        ],
        
     }
  },

  {
     "name":"encoreNGramTextFieldSm",
     "class":"solr.TextField",
     "indexAnalyzer":{

        "tokenizer":{
           "class":"solr.StandardTokenizerFactory" 
        },

        "filters":[
            {
                "class":"solr.LowerCaseFilterFactory"
            },
            {
                "class":"solr.NGramTokenizerFactory",
                "minGramSize":"2",
                "maxGramSize":"100",
            }
        ],
            
     },
     "queryAnalyzer":{
        "tokenizer":{
           "class":"solr.StandardTokenizerFactory" 
        }
        "filters":[
            {
                "class":"solr.LowerCaseFilterFactory"
            },
            {
                "class":"solr.NGramTokenizerFactory",
                "minGramSize":"2",
                "maxGramSize":"100",
            }
        ],
        
     }
  },
  
  

  {
     "name":"encorepartnumber",
     "class":"solr.TextField",
     "indexAnalyzer":{

        "tokenizer":{
           "class":"solr.KeywordTokenizerFactory" 
        },

        "filters":[
            
            {
                "class":"solr.WordDelimiterGraphFilterFactory",
                "preserveOriginal":"0",
                "catenateAll":"1",
                "generateWordParts":"0",
                "generateNumberParts":"0",
                "splitOnCaseChange":"0",
                "splitOnNumerics":"0",
                "catenateWords":"1",
                "catenateNumbers":"1",
                
            },
            
            {
                "class":"solr.FlattenGraphFilterFactory",

            },
            
            {
                "class":"solr.LowerCaseFilterFactory"
            },
            
        ],
            
     },
     "queryAnalyzer":{
        "tokenizer":{
           "class":"solr.KeywordTokenizerFactory" 
        }
        "filters":[

            
            {
                "class":"solr.WordDelimiterGraphFilterFactory",
                "preserveOriginal":"0",
                "catenateAll":"1",
                "generateWordParts":"0",
                "generateNumberParts":"0",
                "splitOnCaseChange":"0",
                "splitOnNumerics":"0",
                "catenateWords":"1",
                "catenateNumbers":"1",
            },
            
            {
                "class":"solr.FlattenGraphFilterFactory",

            },
            
            {
                "class":"solr.LowerCaseFilterFactory"
            },
            
      
        ],
        
     }
  },  
  
  {
     "name":"encorefaceted",
     "class":"solr.StrField",
  },
  
  {
     "name":"encorestring",
     "class":"solr.StrField",
  },
  
  {
     "name":"encorefloat",
     "class":"solr.FloatPointField",
  },
  
  {
     "name":"encoreint",
     "class":"solr.IntPointField",
  },
  

  
  ],

}' http://127.0.0.1:8983/solr/encorea/schema



curl -X POST -H 'Content-type:application/json' --data-binary '{
  "add-field":[
  {
     "name":"make",
     "type":"encoreNGramTextField",
     "stored":true,
     "indexed":true,
     "docValues":false,
  },
  
  {
     "name":"makefaceted",
     "type":"encorefaceted",
     "stored":true,
     "indexed":true,
     "docValues":true,
  },
  

  {
     "name":"model",
     "type":"encoreNGramTextField",
     "stored":true,
     "indexed":true,
     "docValues":false,
  },
  
  {
     "name":"modelfaceted",
     "type":"encorefaceted",
     "stored":true,
     "indexed":true,
     "docValues":true,
  },
  

  {
     "name":"product",
     "type":"encoreNGramTextField",
     "stored":true,
     "indexed":true,
     "docValues":false,
  },
  
  {
     "name":"productfaceted",
     "type":"encorefaceted",
     "stored":true,
     "indexed":true,
     "docValues":true,
  },
  
  {
     "name":"year",
     "type":"encoreNGramTextFieldSm",
     "stored":true,
     "indexed":true,
     "docValues":false,
  },
  
  {
     "name":"yearfaceted",
     "type":"encorefaceted",
     "stored":true,
     "indexed":true,
     "docValues":true,
  },
  
  
  {
     "name":"originalequipmentpart",
     "type":"encorepartnumber",
     "stored":true,
     "indexed":true,
     "docValues":false,
  },
  
  {
     "name":"originalequipmentpartfaceted",
     "type":"encorefaceted",
     "stored":true,
     "indexed":true,
     "docValues":true,
  },
  
  {
     "name":"partnumber",
     "type":"encorepartnumber",
     "stored":true,
     "indexed":true,
     "docValues":false,
  },
  
  {
     "name":"partnumberfaceted",
     "type":"encorefaceted",
     "stored":true,
     "indexed":true,
     "docValues":true,
  },  
  
  
  {
     "name":"engineliters",
     "type":"encorefloat",
     "stored":true,
     "indexed":true,
     "docValues":true,
  },
  
  {
     "name":"enginecc",
     "type":"encoreint",
     "stored":true,
     "indexed":true,
     "docValues":true,
  },

  {
     "name":"enginecylinder",
     "type":"encoreint",
     "stored":true,
     "indexed":true,
     "docValues":true,
  },

  {
     "name":"engineblock",
     "type":"encorestring",
     "stored":true,
     "indexed":true,
     "docValues":true,
  },
  
  {
     "name":"engineboreinch",
     "type":"encorefloat",
     "stored":true,
     "indexed":true,
     "docValues":true,
  },

  {
     "name":"engineboremetric",
     "type":"encorefloat",
     "stored":true,
     "indexed":true,
     "docValues":true,
  },
  
  {
     "name":"enginestrokeinch",
     "type":"encorefloat",
     "stored":true,
     "indexed":true,
     "docValues":true,
  },
  
  {
     "name":"engstrokemetric",
     "type":"encorefloat",
     "stored":true,
     "indexed":true,
     "docValues":true,
  },
  
  {
     "name":"engine",
     "type":"encorestring",
     "stored":true,
     "indexed":true,
     "docValues":false,
  },

  {
     "name":"enginefaceted",
     "type":"encorestring",
     "stored":true,
     "indexed":true,
     "docValues":true,
  },
  
  {
     "name":"imageprefix",
     "type":"encorestring",
     "stored":true,
     "indexed":false,
     "docValues":false,
  },  
 
  {
     "name":"numberofimages",
     "type":"encorestring",
     "stored":true,
     "indexed":false,
     "docValues":false,
  },  

  {
     "name":"imagesuffix",
     "type":"encorestring",
     "stored":true,
     "indexed":false,
     "docValues":false,
  },  
  
  ],
  
  
  
}' http://127.0.0.1:8983/solr/encorea/schema




curl -X POST -H 'Content-type:application/json' --data-binary '{


  "add-field-type":[
  
  {
     "name":"encorelocation",
     "class":"solr.LatLonPointSpatialField",
     
  },
  
  {
     "name":"encorelocationrpt",
     "class":"solr.SpatialRecursivePrefixTreeFieldType",
     
  },
  
  ],

}' http://127.0.0.1:8983/solr/encorel/schema




curl -X POST -H 'Content-type:application/json' --data-binary '{
  "add-field":[

  {
     "name":"storename",
     "type":"encorestring",
     "indexed":"false",
     "stored":"true",
  },

  {
     "name":"storecontract",
     "type":"encorestring",
     "indexed":"false",
     "stored":"true",
  },

  {
     "name":"storeid",
     "type":"encorestring",
     "indexed":"false",
     "stored":"true",
  },

  {
     "name":"storeaddress",
     "type":"encorestring",
     "indexed":"false",
     "stored":"true",
  },

  {
     "name":"storecity",
     "type":"encorestring",
     "indexed":"false",
     "stored":"true",
  },

  {
     "name":"storezip",
     "type":"encorestring",
     "indexed":"false",
     "stored":"true",
  },

  {
     "name":"storestate",
     "type":"encorestring",
     "indexed":"false",
     "stored":"true",
  },

  {
     "name":"storeurl",
     "type":"encorestring",
     "indexed":"false",
     "stored":"true",
  },
  
  {
     "name":"storephone",
     "type":"encorestring",
     "indexed":"false",
     "stored":"true",
  },
  
  {
     "name":"latlonlocation",
     "type":"encorelocation",
     "indexed":"true",
     "stored":"true",
  },

  {
     "name":"latlonlocationdv",
     "type":"encorelocation",
     "indexed":"true",
     "stored":"true",
     "docValues":"true",
  },
  
  ],
}' http://127.0.0.1:8983/solr/encorel/schema




