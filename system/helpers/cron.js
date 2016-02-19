var PythonShell = require('python-shell');
var _ = require('lodash');
var unirest = require('unirest');

module.exports = function(System) {
  var options = {
    mode: 'text',
    pythonPath: 'python',
    pythonOptions: ['-u'],
    scriptPath: './scripts/',
    args: ['-u', System.config.citeULike.username, '-p', System.config.citeULike.password]
  };

  var plugin = {
    /**
     * The helper register method
     * @return {Void}
     */
    register: function () {
      
      var isStarted = false;

      return {
        start: function() {
          var self = this;
          if (isStarted) return; //run only once

          isStarted = true;

          self.updateDiigo();
          self.runScripts();

          setInterval(function() {
            self.updateDiigo();
            self.runScripts();
          }, System.config.crons.runEvery * 60 * 1000);
        },

        runScripts: function() {
          var runScript = this.runScript;          
          runScript('citeusync.py')
            .then(function(results) {
              runScript('cul2es.py')
                .then(function(results) {
                  console.log('CiteULike is done!');
                });
            });

          runScript('lt2es.py')
            .then(function(results) {
              console.log('Libthing is done!');
            })

        },

        runScript: function(name, cb) {
          var thenFunc;
          return {
            then: function(cb) {
              thenFunc = cb;
              init();
            }
          }

          function init() {
            PythonShell.run(name, options, function (err, results) {
              if (err) throw err;
              results = results === null ? 'No output from script' : results;
              // results is an array consisting of messages collected during execution 
              console.log('%s: %j', name, results);
              thenFunc(results);
            });
          }
        },

        updateDiigo: function() {
          var ctrl = require('../../modules/applets/server/controllers/updateDiigo')(System);
          ctrl.updateDiigo(function() {
            console.log('Diigo is done!');
          });
        }
      };
    }
  };

  /**
   * Attributes to identify the plugin
   * @type {Object}
   */
  plugin.register.attributes = {
    name: 'Crons for ElasticSearch',
    key: 'cron',
    version: '1.0.0'
  };
  return plugin;
};