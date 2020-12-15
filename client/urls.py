from django.urls import path
from django.conf.urls import url
from .views import index

urlpatterns = [
    path('', index), # for the empty url
    url(r'^.*/$', index)  # for all other urls
]

"""
We have to add it twice, first to catch the empty URL, e.g. https://lollipop.ai
and second to catch every other URL e.g. https://lollipop.ai/lollisignup/.
"""