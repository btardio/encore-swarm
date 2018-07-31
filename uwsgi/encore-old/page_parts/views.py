from django.shortcuts import render

# Create your views here.



from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
import urllib.request

import logging

from django.utils.encoding import smart_text

# Get an instance of a logger
jslogger = logging.getLogger('jslogger')

#from pudb import set_trace

# Create your views here.

def view_page_parts(request):

  #set_trace()

  

  renderedtemplates = ''

  # header 00 template
  #template = loader.get_template('cv/header00.html')
  #context = { 'title': 'Opening Page', 'fancy_header': fancy_header.gen_fancy_header() }
  #context = { 'title': 'Tardio, Brandon' }
  #renderedtemplates += template.render(context, request)

  template = loader.get_template('encore_parts_page/page_parts.html')
  context = { }
  renderedtemplates += template.render(context, request)

  # footer 00 template
  #template = loader.get_template('cv/footer00.html')
  #context = { 'title': 'Opening Page' }
  #renderedtemplates += template.render(context, request)

  return HttpResponse(renderedtemplates)



#def view_solr_through(request, solr=''):
    #print ( solr )
    
    ##print ( help ( request ) ) 
    
    #print ( 'http://127.0.0.1:8983' + request.get_full_path() )
    
    
    
    #f = urllib.request.urlopen('http://127.0.0.1:8983' + request.get_full_path())
    
    #return HttpResponse(f.read())
    
    
def view_javascript_error(request):
    

    
    if 'errorcode' in request.GET and len(request.GET['errorcode']) == 3:
        if request.GET['errorcode'] == '100':
            jslogger.error('http://127.0.0.1/solr/encore1/select?q=*:*&rows=0&facet=true", {"facet.field": "yearfaceted"} failed.')
            
        elif request.GET['errorcode'] == '101':
            jslogger.error('http://127.0.0.1/solr/encore1/select?q=*:*&rows=0&facet=true", {"facet.field": "makefaceted"} failed.')

        elif request.GET['errorcode'] == '102':
            jslogger.error('http://127.0.0.1/solr/encore1/select?q=*:*&rows=0&facet=true", {"facet.field": "modelfaceted"} failed.')
    
        elif request.GET['errorcode'] == '103':
            jslogger.error('http://127.0.0.1/solr/encore1/select?q=*:*&rows=0&facet=true", {"facet.field": "enginelitersfaceted"} failed.')   
    
        elif request.GET['errorcode'] == '104':
            jslogger.error('http://127.0.0.1/solr/encore1/select?q=*:*&rows=0&facet=true", {"facet.field": "enginecylinder"} failed.')   

        elif request.GET['errorcode'] == '105':
            jslogger.error('http://127.0.0.1/solr/encore1/select?q=*:*&rows=0&facet=true", {"facet.field": "enginecc"} failed.')   
            
        elif request.GET['errorcode'] == '106':
            jslogger.error('http://127.0.0.1/solr/encore1/select?q=*:*&rows=0&facet=true", {"facet.field": "engineboreinch"} failed.')   

        elif request.GET['errorcode'] == '107':
            jslogger.error('http://127.0.0.1/solr/encore1/select?q=*:*&rows=0&facet=true", {"facet.field": "enginestrokeinch"} failed.')   

        elif request.GET['errorcode'] == '108':
            jslogger.error('http://127.0.0.1/solr/encore1/select?q=*:*&rows=0&facet=true", {"facet.field": "productfacet"} failed.')  

        elif request.GET['errorcode'] == '109':
            jslogger.error('http://127.0.0.1/solr/encore1/select?q= Search in makesearchrequest.')  

        elif request.GET['errorcode'] == '110':        
            jslogger.error('Error in executepartdetailsearch.')

        elif request.GET['errorcode'] == '111':        
            jslogger.error('Error in executeoemsearch.')

        elif request.GET['errorcode'] == '112':        
            jslogger.error('Error in executeoempartsearch.')
            
        else:
            js.logger.error("Unknown error code.")
            
    if 'errormessage' in request.GET:
        jslogger.error(smart_text(request.GET['errormessage']))
            
    #jslogger.error('Something went wrong!')
    
    return HttpResponse('')


















    
    
    
    
