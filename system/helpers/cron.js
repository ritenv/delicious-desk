var PythonShell = require('python-shell');
var _ = require('lodash');

var options = {
  mode: 'text',
  pythonPath: 'python',
  pythonOptions: ['-u'],
  scriptPath: './scripts/'
};

module.exports = function(System) {
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
          self.runScripts();
          setInterval(function() {
            self.runScripts();
          }, System.config.crons.runEvery * 60 * 1000);
        },

        runScripts: function() {
          var runScript = this.runScript;
          console.log(runScript);

          runScript('citeusync.py')
            .then(function(results) {
              runScript('cul2es.py')
                .then(function(results) {
                  console.log('CiteULike is done!');
                });
            });


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
              // results is an array consisting of messages collected during execution 
              console.log('%s: %j', name, results);
              thenFunc(results);
            });
          }
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