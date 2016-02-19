'use strict';
console.log('Config in development');
module.exports = {
  REQUESTS_DELAY: 0,
  REQUESTS_DELAY_SYSTEM: 0,
  baseURL: 'http://localhost:1212',
  db: process.env.MONGOHQ_URL || 'mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost') + '/climbing-dots',
  server: {
    host: 'localhost',
    port: 1212
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
    runEvery: 30 //minutes
  },
  citeULike: {
    username: 'acecentre',
    password: 'ol83ql',
  },
  diigo: {
    apiKey: process.env.DIIGO_API_KEY,
    username: process.env.DIIGO_USERNAME,
    password: process.env.DIIGO_PASSWORD
  }
};