from citeulike_api import citeulike_api

outjsonpath = path(options.docroot)/options.bibtex_json_file

if os.path.isabs(options.attachment_path):
	outpdfpath = path(options.attachment_path)
else:
	outpdfpath = path(options.docroot)/options.attachment_path

cul = CiteULike(
	username=options.cul_username,
	password=options.cul_pass,
	json_cache=outjsonpath,
	attachment_path=outpdfpath
)

cul.cache_records()
bibtex_string = cul.render('bibtex')
with codecs.open(outbibtexpath, 'w', 'utf-8') as bf:
	bf.write(bibtex_string)