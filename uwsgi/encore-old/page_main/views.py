
from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
#from app_fancy_header.models import fancy_header


#from pudb import set_trace

# Create your views here.

def view_page_main(request):

  #set_trace()

  renderedtemplates = ''

  # header 00 template
  #template = loader.get_template('cv/header00.html')
  #context = { 'title': 'Opening Page', 'fancy_header': fancy_header.gen_fancy_header() }
  #context = { 'title': 'Tardio, Brandon' }
  #renderedtemplates += template.render(context, request)

  template = loader.get_template('page_main/page_main.html')
  context = { }
  renderedtemplates += template.render(context, request)

  # footer 00 template
  #template = loader.get_template('cv/footer00.html')
  #context = { 'title': 'Opening Page' }
  #renderedtemplates += template.render(context, request)

  return HttpResponse(renderedtemplates)



