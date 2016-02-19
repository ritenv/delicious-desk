from datetime import datetime
from elasticsearch import Elasticsearch
es = Elasticsearch()

try:
    es.indices.delete(index='aceresources')
    print "Deleted old index, adding new index now..."
except:
    print "Creating index for the first time..."

es.indices.create(index='aceresources')

es.indices.put_mapping(
    index='aceresources',
    doc_type='articles',
    body={
        'articles': {
            'properties': {
                'id': {'type': 'integer'},
                'title': {'type': 'string'},
                'abstract': {'type': 'string'},
                'comments': {'type': 'string'},
                'URLS': {'type': 'string'},
                'citeulike': {'type': 'string'},
                'attachment': {
                    'type': 'attachment',
                    'fields': {
                        'content': {
                            'type': 'string',
                            'copy_to': 'contentcopy'
                        }
                    }
                },
                'authors': {'type': 'string'},
                'contentcopy': {'type': 'string'},
                'tags': {'type': 'string'},
                'created': {'type': 'date'}
            }
        }
    }
)

es.indices.put_mapping(
    index='aceresources',
    doc_type='links',
    body={
        'links': {
            'properties': {
                'id': {'type': 'integer'},
                'title': {'type': 'string'},
                'comments': {'type': 'string'},
                'delicious': {'type': 'string'},
                'URL': {'type': 'string'},
                'tags': {'type': 'string'},
                'created': {'type': 'date'}
            }
        }
    }
)


es.indices.put_mapping(
    index='aceresources',
    doc_type='books',
    body={
        'books': {
            'properties': {
                'id': {'type': 'integer'},
                'title': {'type': 'string'},
                'authors': {'type': 'string'},
                'date': {'type': 'string'},
                'isbn': {'type': 'string'},
                'comments': {'type': 'string'},
                'tags': {'type': 'string'},
                'cover': {'type': 'string'}
            }
        }
    }
)
