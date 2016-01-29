#!/usr/bin/python
from datetime import datetime
from elasticsearch import Elasticsearch
es = Elasticsearch()
import json
import os
import urllib, urllib2
from bs4 import BeautifulSoup
import delicious 
img_path = '/Users/willwade/bin/ACEResources/static/img/siteimages'


def get_clean_text(html):
    soup = BeautifulSoup(html)
    # kill all script and style elements
    for script in soup(["script", "style"]):
        script.extract()    # rip it out
    # get text
    text = soup.get_text()
    # break into lines and remove leading and trailing space on each
    lines = (line.strip() for line in text.splitlines())
    # break multi-headlines into a line each
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    # drop blank lines
    text = '\n'.join(chunk for chunk in chunks if chunk)

    return(text.encode('utf-8'))

from subprocess import call
#url = "http://feeds.delicious.com/v2/json/acecentre?count=100"
#url = "https://api.del.icio.us/v1/posts/all?red=api"
# Some work to do here to only download the most recent json entries .. 
d = delicious.open('acecentre','password1#')
cover = ''
id = 1
for link in d.posts():  
    # if ending is 
    content = ''
    nonHtmlTypes = ['mp3','mpe','pdf','doc']
    # get ending 
    print link
    exit()
    if link['href'][:-3] not in nonHtmlTypes:        
        try:
            resp = urllib2.urlopen(link['href'])
        except urllib2.URLError, e:
            pass
        else:
            # Not 404'ing
            #whats the content type?
            file=urllib.urlopen(link['href'])
            type = file.info().getheader("Content-Type")
            if type.find('html'):
                # get the text
                content = get_clean_text(file)
            
            # Now grab the image..
            os.system('/usr/local/bin/webkit2png -CD '+img_path+' -o '+str(id)+' '+link['href'])
            if os.path.isfile(img_path+'/'+str(id)+'-clipped.png'):
                cover = str(id)+'-clipped.png'
            
    doc = {
        'id': id,
        'title': link['description'],
        'comments': link['extended'],
        'URL': link['href'],
        'tags': link['tags'],
        'created': link['time_parsed'].tm_year,
        'content': content,
        'cover': cover
    }
    
    # lets get an image if we can..
    
    #print doc
    res = es.index(index="aceresources", doc_type='links', id=id, body=doc)
    print(res['created'])
    id = id+ 1


    