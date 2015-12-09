var mongoose = require('mongoose');
var Links = mongoose.model('Link');
var _ = require('lodash');

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

    if (req.query.identifier) {
      criteria.identifier = req.query.identifier;
    }

    if (req.query._id) {
      criteria._id = req.query._id;
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
      // Collections.findOne({_id: req.body._id}, function(err, record) {
      //   if (err || !record) {
      //     return json.unhappy({error: err, record: record}, res);
      //   }
        
      //   // record.introText = req.body.introText;

      //   return record.update(function(err, record) {
      //     if (err || !record) {
      //       return json.unhappy({error: err, record: record}, res);
      //     }

      //     console.log(arguments);
      //     return json.happy(record, res);
      //   })
      // })
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