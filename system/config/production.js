'use strict';

module.exports = {
  REQUESTS_DELAY: 0,
  REQUESTS_DELAY_SYSTEM: 0,
  baseURL: process.env.BASEURL,
  db: 'mongodb://localhost:27017/' + (process.env.DB || 'climbing_dots'),
  server: {
    host: 'localhost',
    port: process.env.PORT || 8111
  },
  secret: 'ddesksecret',
  settings: {
  	perPage: 10,
  	email: {
  		service: 'Gmail',
      emailAddress: process.env.EMAILADD,
      emailPassword: process.env.EMAILPASS
  	}
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: 'atwork'
  },
  elastic: {
    server: 'localhost:9200',
    db: 'aceresources'
  },
  crons: {
    runEvery: 15 //minutes
  },
  diigo: {
    apiKey: process.env.DIIGO_API_KEY,
    username: process.env.DIIGO_USERNAME,
    password: process.env.DIIGO_PASSWORD
  }
};