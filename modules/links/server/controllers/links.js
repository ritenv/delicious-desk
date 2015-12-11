var mongoose = require('mongoose');
var Links = mongoose.model('Link');
var Collections = mongoose.model('Collection');
var unirest = require('Unirest');
var _ = require('lodash');
var S = require('string');
var querystring = require('querystring');

module.exports = function(System) {
  var obj = {};
  var json = System.plugins.JSON;
  var event = System.plugins.event;
  var sck = System.webSocket;

  /**
   * List all
   * @param  {Object} req The request object
   * @param  {Object} res The response object
   * @return {Void}
   */
  obj.list = function (req, res) {
    var user = req.user;

    var criteria = {
      // creator: req.user
    };

    if (req.query.linkType) {
      criteria.linkType = req.query.linkType;
    }

    if (req.query._id) {
      criteria._id = req.query._id;
    }

    if (req.query.collectionIdentifier) {
      return Collections
        .findOne({identifier: req.query.collectionIdentifier})
        .populate('attachments')
        .exec(function(err, collection) {
          if (err || !collection) {
            return json.unhappy({error: err, collection: collection}, res);
          }

          var attachments = collection.attachments;

          attachments = _.filter(attachments, function(attachment) {
            return attachment.linkType == criteria.linkType;
          });
          return json.happy({
            records: attachments
          }, res);
        });
    }

    Links.find(criteria, null, {sort: {title: 1}})
    .populate('creator')
    .exec(function(err, records) {
      if (err) {
        json.unhappy(err, res);
      } else {
        json.happy({
          records: records
        }, res);
      }
    });
  };

  obj.delete = function (req, res) {
    var user = req.user;

    var criteria = {
      // creator: req.user
    };

    if (req.query._id) {
      criteria._id = req.query._id;
    }

    Links.findOne(criteria, null, {sort: {title: 1}})
    .populate('creator')
    .exec(function(err, record) {
      if (err) {
        return json.unhappy(err, res);
      } else {
        record.remove(function(err, record) {
          if (err) {
            return json.unhappy(err, res);
          }
          return json.happy({
            record: record
          }, res);
        });
      }
    });
  };

  /**
   * Upload a user's face
   * @param  {Object} req Request
   * @param  {Object} res Response
   * @return {Void}     
   */
  obj.uploadDocument = function(req, res) {
    var file = req.files.file;

    /**
     * Check extension
     */
    // if (['png', 'jpg', 'jpeg', 'gif', 'doc', 'docx'].indexOf(file.extension) === -1) {
    //   return json.unhappy({message: 'Only specific formats allowed.'}, res);
    // }

    /**
     * Get file name
     * @type {String}
     */
    var filename = file.path.substr(file.path.lastIndexOf('/')+1);

    var fs = require('fs');
    var AWS = require('aws-sdk');
    
    /**
     * Config params stored in the environment
     * @type {String}
     */
    AWS.config.accessKeyId = System.config.aws.accessKeyId;
    AWS.config.secretAccessKey = System.config.aws.secretAccessKey;
    var bucket = System.config.aws.bucket;

    /**
     * Set bucket and other params
     * @type {Object}
     */
    var params = {
      Bucket: bucket, 
      Key: filename,
      Body: fs.readFileSync(file.path),
      ContentType: 'application/image',
      ACL: 'public-read'
    };

    var s3 = new AWS.S3();

    /**
     * Upload to s3
     */
    s3.putObject(params, function(error, data) {
      if (error) {
        throw error;
      }
    });

    var url = 'https://s3.amazonaws.com/' + bucket + '/' + filename;

    return json.happy({
      url: url
    }, res);

  };


  /**
   * Create
   * @param  {Object} req The request object
   * @param  {Object} res The response object
   * @return {Void}
   */
  obj.create = function(req, res) {
    if (req.body.tags) {
      req.body.tags = req.body.tags.toString().replace(/\s/g, '').split(',');
    }
    //creating
    if (!req.body._id) {
      var record = new Links(req.body);
      record.creator = req.user._id;
      record.identifier = randomAlphaNum();
      record.save(function(err) {
        if (!record.skipDiigo) {
          var encoded = new Buffer(System.config.diigo.username + ':' + System.config.diigo.password).toString('base64');
          var description = record.description ? record.description.replace(/\&lt;/g, '<').replace(/\&gt;/g, '>') : '';
          description = S(description).stripTags().s;
          var tags = [record.linkType].concat(record.tags ? record.tags : []).join(',')
          unirest
            .post('https://secure.diigo.com/api/v2/bookmarks')
            .header('Accept', 'application/json')
            .header('Authorization', 'Basic ' + encoded)
            .field('key', System.config.diigo.apiKey)
            .field('title', record.title)
            .field('url', record.url)
            .field('shared', true)
            .field('tags', tags)
            .field('desc', description ? description.substr(0, 250) : '')
            .end(function(response) {
              record.diigoRecord = response.body;
              record.save();
            });
        }

        if (err) {
          return json.unhappy(err, res);
        }
        return json.happy(record, res);
      });

    //editing
    } else {
      var updates = {
        title: req.body.title,
        linkType: req.body.linkType,
        defaultInAll: req.body.defaultInAll,
        description: req.body.description,
        url: req.body.url,
        tags: req.body.tags
      };

      Links.update({_id: req.body._id}, updates, function(err) {
        if (err) {
          return json.unhappy(err, res);
        }
        return json.happy(req.body, res);
      });
    }

    function randomAlphaNum() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
  };

  return obj;
};