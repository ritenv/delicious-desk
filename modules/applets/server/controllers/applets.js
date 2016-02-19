var mongoose = require('mongoose');
var _ = require('lodash');
var Applet = mongoose.model('Applet');

module.exports = function(System) {
  var obj = {};
  var json = System.plugins.JSON;
  var event = System.plugins.event;
  var cron = System.plugins.cron;
  var sck = System.webSocket;

  // Start running the crons
  cron.start();

  /**
   * List all
   * @param  {Object} req The request object
   * @param  {Object} res The response object
   * @return {Void}
   */
  obj.list = function (req, res) {
    var user = req.user;

    var criteria = {
      creator: req.user
    };

    Applet.find(criteria, null, {sort: {title: 1}})
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

  /**
   * Expose the elastic API
   * @param  {Object} req The request object
   * @param  {Object} res The response object
   * @return {Void}
   */
  obj.elastic = function(req, res) {
    var elastic = System.plugins.elastic;
    var params = {}; //_.extend({}, req.query);

    if (req.params.documentType) {
      params.type = req.params.documentType;
    }

    // if (req.query.fields) {
    params.body = {
      query: {
        filtered: {
          query: {}
        }
      }
    };
    if (!req.query.fields) {
      params.body.query.filtered.query = {
        match: {
          // match the query agains all of
          // the fields
          _all: req.query.q
        }
      };
    } else {
      params.body.query.filtered.query = {
        multi_match: {
          query: req.query.q,
          fields: req.query.fields.split(',')
        }
      };
    }
    // }

    elastic.search(params, function(err, response) {
      if (err) {
        return json.unhappy(err, res);
      }

      return json.happy({query: params, data: response}, res);
    })
  };

  /**
   * Create
   * @param  {Object} req The request object
   * @param  {Object} res The response object
   * @return {Void}
   */
  obj.create = function(req, res) {
    var record = new Applet(req.body);
    record.creator = req.user._id;
    record.save(function(err) {
      if (err) {
        return json.unhappy(err, res);
      }
      return json.happy(post, res);
    });
  };

  return obj;
};