file_path='/Users/riten/projects/freelancer/search-engine/scripts/data/files/sample.pdf'
file=$(base64 $file_path)
curl -PUT 'http://127.0.0.1:9200/aceresources/articles/13859113?pretty=1'  -d '
{
   "attachment" : "'$file'"
}
'


curl -XGET 'http://127.0.0.1:9200/aceresources/articles/_search?pretty=1'  -d '
{
   "query" : {
      "query_string" : {
         "query" : "Rajesh"
      }
   }
}
'