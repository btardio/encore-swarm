from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
import urllib.request
import logging
from django.utils.encoding import smart_text
from django.conf import settings
import requests

# todo: paging

# Get an instance of a logger
jslogger = logging.getLogger('jslogger')



# Create your views here.


def view_page_parts(request):

  renderedtemplates = ''

  # header 00 template
  template = loader.get_template('page_header/page_header.html')
  context = { 'partspage': True,  }
  renderedtemplates += template.render(context, request)

  template = loader.get_template('page_parts/page_parts.html')
  context = { }
  renderedtemplates += template.render(context, request)

  # footer 00 template
  template = loader.get_template('page_footer/page_footer.html')
  context = { 'filter': '-webkit-filter: invert(100%); filter: invert(100%);' }
  renderedtemplates += template.render(context, request)

  return HttpResponse(renderedtemplates)






def view_makefacetrequest(request):
    
    acceptablefields = ['facet.mincount', 'facet.limit', 'facet.field', 'facet.sort', 'fq']
    payload = {}

    for param in request.GET:
        if param in acceptablefields:
            payload[param] = request.GET[param]
    
    for server in settings.SOLR_SERVERS:
    
        requeststr = 'http://' + server + '/solr/encore1/select?q=*:*&rows=0&facet=true'
        
        r = requests.get( requeststr, params=payload )
    
        if r.ok: break
        
    return HttpResponse(r.text)
    


    
def view_makesearchrequest(request):
    
    acceptablefields = ['fq','sort']
    
    payload = {}

    for param in request.GET:

        if param in acceptablefields:
            payload[param] = request.GET[param]

    for server in settings.SOLR_SERVERS:
    
        requeststr = 'http://' + server + '/solr/encore1/select?q=*:*&fl=partnumber,year,make,model,engineliters,enginecylinder,enginecc,engineblock,product&rows=10000'
        
        r = requests.get( requeststr, params=payload )
    
        if r.ok: break
        
    return HttpResponse(r.text)

    
def view_executepartdetailsearch(request):
    
    partnumber = None

    if 'partnumber' in request.GET:
        partnumber = request.GET['partnumber']
    else: return HttpResponse('')

    for server in settings.SOLR_SERVERS:
    
        requeststr = "http://" + server + "/solr/encore1/select?q=partnumber:\"" + partnumber + "\"&fl=partnumber,year,make,model,engineliters,enginecylinder,enginecc,engineblock,product&rows=1"
        
        r = requests.get( requeststr )
    
        if r.ok: break
        
    return HttpResponse(r.text)


def view_executeoemsearch(request):
    
    acceptablefields = ['sort']

    payload = {}

    for param in request.GET:

        if param in acceptablefields:
            payload[param] = request.GET[param]
    
    partnumber = None

    if 'partnumber' in request.GET:
        partnumber = request.GET['partnumber']
    else: return HttpResponse('')

    for server in settings.SOLR_SERVERS:
        
        # note: could change number of rows
        requeststr = "http://" + server + "/solr/encore1/select?q=partnumber:\"" + partnumber + "\"&fl=partnumber,year,make,model,engineliters,enginecylinder,enginecc,engineblock,product&rows=100000"
        
        r = requests.get( requeststr, payload )
    
        if r.ok: break
        
    return HttpResponse(r.text)
    
    
#

def view_executeoempartsearch(request):
        
    oemnumber = None

    if 'oemnumber' in request.GET:
        oemnumber = request.GET['oemnumber']
    else: return HttpResponse('')

    for server in settings.SOLR_SERVERS:
        
        requeststr = "http://" + server + "/solr/encore1/select?q=originalequipmentpart:\"" + oemnumber + "\"&fl=partnumber,year,make,model,engineliters,enginecylinder,enginecc,engineblock,product&rows=1"
        
        r = requests.get( requeststr )
    
        if r.ok: break
        
    return HttpResponse(r.text)
    

    
def view_javascript_error(request):
    
    return
    
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


















    
    
    
    
