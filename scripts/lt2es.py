#!/usr/bin/python
from datetime import datetime
from elasticsearch import Elasticsearch
es = Elasticsearch()
import json
import os
import urllib2
url = "https://www.librarything.com/api_getdata.php?userid=ace-centre&key=195079041&booksort=entry&showTags=1&showCollections=1&responseType=json&max=1000"
# Some work to do here to only download the most recent json entries .. 

dataDir = './scripts/data/'

books = json.load(open(dataDir+'libthing.json'))

for book in books['books']:
    title = abstract = comments = urls = citeulike = authors = tags = citation = created = file64 = fname = attachment = ''
    # there is a bug with the date thing.. cant work out what it is..
    b = books['books'][book]
    for item in b['collections']:
        if b['collections'][item] == 'Oxford' or b['collections'][item] == 'Oldham':
            location = b['collections'][item]
        else:
            location = ''
    
    print location
        
    doc = {
        'id': b['book_id'],
        'title': b['title'],
        'authors' : b['author_fl'],
        'comments': b['comments'] if 'comments' in b else '',
        'tags' : b['tags'] if 'tags' in b else {},
        'created': b['publicationdate'] if 'publicationdate' in b else '',
        'cover' : b['cover'] if 'cover' in b else '',
        'location': location
    }
    
    #print doc
    res = es.index(index="aceresources", doc_type='books', id=b['book_id'], body=doc)
    print(res['created'])
    



    