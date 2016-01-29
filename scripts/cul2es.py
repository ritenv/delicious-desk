from datetime import datetime
from elasticsearch import Elasticsearch
es = Elasticsearch()
import json
import os

# Some work to do here to only download the most recent json entries .. and login and grab this
dataDir = './scripts/data/'

cites = json.load(open(dataDir+'citeulike.json'))
for cite in cites:
    title = abstract = comments = urls = citeulike = authors = tags = citation = created = file64 = fname = attachment = ''
    # there is a bug with the date thing.. cant work out what it is..
    created = '1900'
    
    title = cite['title']  
    abstract = cite['abstract'] if 'abstract' in cite else ''
    comments = cite['comment'] if 'comment' in cite else ''
    if 'linkouts' in cite:
        for linkout in cite['linkouts']:
            urls += linkout['url'] + ', '
    else:
        urls = ''
    citeulike = cite['href']
    if 'authors' in cite:
        for author in cite['authors']:
            authors += author  + ', '
    if 'tags' in cite:
        tags = cite['tags']
    citation = cite['citation']
    if 'published' in cite:
        created = cite['published'][0]
        # Just want year
        '''
        if len(cite['published']) == 2:
            created = cite['published'][0] + '-' + cite['published'][1]  
        if len(cite['published']) == 3:
            created = cite['published'][0] + '-' + cite['published'][1] + '-' +  cite['published'][2]
        '''
    file64 = ''
    if 'userfiles' in cite:
        fname = dataDir+'files/'+cite['userfiles'][0]['name']
        print 'finding: ' + fname
        if os.path.isfile(fname):
            print 'found!'   
            file64 = open(fname, "rb").read().encode("base64")
    attachment = file64        
    
    
    doc = {
        'title': title,
        'abstract' : abstract,
        'comments': comments,
        'URLS' : urls,
        'citeulike':citeulike,
        'authors' : authors,
        'tags' : tags,
        'created': created,
        'attachment': file64
    }
    
    #print doc
    res = es.index(index="aceresources", doc_type='articles', id=cite['article_id'], body=doc)
    print(res['created'])
    