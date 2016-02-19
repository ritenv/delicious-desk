var _ = require('lodash');

module.exports = function(System) {
  var sck = System.webSocket;
  var elasticsearch = require('elasticsearch');

  var plugin = {
    /**
     * The helper register method
     * @return {Void}
     */
    register: function () {
      var client = new elasticsearch.Client({
        host: System.config.elastic.host
      });

      client.ping({
        requestTimeout: 30000,
        hello: "elasticsearch"
      }, function (error) {
        if (error) {
          console.error('elasticsearch cluster is down!');
        } else {
          console.log('Connected to ElasticSearch');
        }
      });

      return {
        search: function(params, cb) {
          params = _.extend({index: System.config.elastic.db}, params);
          return client.search(params).then(function(response) {
                cb(null, response);
              }, function(err) {
                cb(err, {});
              });
        },
        upsert: function(doc, cb) {
          client.create({
            index: System.config.elastic.db,
            type: 'links',
            body: doc
          }, cb);

        }
      };
    }
  };

  /**
   * Attributes to identify the plugin
   * @type {Object}
   */
  plugin.register.attributes = {
    name: 'Elastic Search Helper',
    key: 'elastic',
    version: '1.0.0'
  };
  return plugin;
};