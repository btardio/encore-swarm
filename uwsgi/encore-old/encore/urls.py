"""django_parts URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.urls import re_path

#from encore import views


from page_parts.views import view_page_parts
from page_parts.views import view_javascript_error
from page_main.views import view_page_main

#from encore_parts_page.views import view_solr_through

urlpatterns = [
    path('admin/', admin.site.urls),
    path(r'', view_page_main),
    path(r'parts', view_page_parts),
    path(r'logerror', view_javascript_error),
#    re_path(r'solr(?P<solr>.*)', view_solr_through),
]













