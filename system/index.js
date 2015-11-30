/**
 * Load dependencies
 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var mongoose = require('mongoose');
var Config = require('./config/' + (process.env.NODE_ENV || 'development'));
var bodyParser = require('body-parser');
var multer = require('multer'); 
var morgan = require('morgan');
var path = require('path');
var nodemailer = require('nodemailer');
var _ = require('lodash');

/**
 * Load the settings model
 */
require('./models/settings');
var SystemSettings = mongoose.model('settings');

/**
 * Middleware
 */
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer({ dest: './public/uploads/'})); // for parsing multipart/form-data
app.use(morgan("dev"));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

var options = {
  dotfiles: 'ignore',
  etag: false,
  // extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
};
app.use(express.static('public', options));
app.use('/dist', express.static('dist', options));
app.use('/system', express.static('system/public', options));
app.use('/system/public/views', express.static('system/public/views', options));

/**
 * Path where modules are located
 */
var modulePath = __dirname + '/../modules';
var moduleURL = 'modules';

/**
 * Create new server
 * @return {Void}
 */
function startServer() {
  app.use(function(req, res, next) {
    var output = fs.readFileSync(__dirname + '/../public/index.html');
    res.type('html').send(output);
    next();
  });
  var server = http.listen(Config.server.port, function() {
    var host = server.address().address
    var port = server.address().port

    console.log('Running at http://%s:%s', host, port);
  });
}

/**
 * Load built-in system routes
 * @param  {Object} System The system object
 * @return {Void}
 */
function systemRoutes(System) {
  var routes = [];
  routes = routes.concat(require('./routes/search')(System));
  routes = routes.concat(require('./routes/settings')(System));

  routes.forEach(function(route) {
    var moduleRouter = express.Router();
    if (!route.authorized) {
      moduleRouter[route.method](route.path, System.auth.justGetUser, function(req, res) {
          setTimeout(function() {
            route.handler(req, res);
          }, System.config.REQUESTS_DELAY_SYSTEM);
        });
    } else {
      moduleRouter[route.method](route.path, System.auth.ensureAuthorized, function(req, res) {
        setTimeout(function() {
          route.handler(req, res);
        }, System.config.REQUESTS_DELAY_SYSTEM);
      });
    }
    app.use('/', moduleRouter);
  });
}

/**
 * Load system settings
 * @param  {Object} System The system object
 * @return {Void}
 */
function loadSettings(System, cb) {
  SystemSettings.find({}).exec(function(err, settings) {
    if (err) throw err;
    settings.map(function(setting) {
      System.settings[setting.name] = setting.value;
    });
    System.mailer = nodemailer.createTransport({
      service: Config.settings.email.service,
      auth: {
        user: System.settings.email,
        pass: System.settings.emailPassword
      }
    });
    cb();
  });
}

/**
 * Connect to the database
 * @return {Object} Returns the connection object
 */
var dbConnect = function() {
  var db = mongoose.connect(Config.db);
  return db;
};

/**
 * Connect to the database
 * @return {Object} Returns the connection object
 */
var loadPlugins = function(startingPath, System) {
  var helpersPath = startingPath + '/helpers';
  if (!fs.existsSync(helpersPath)) {
    return false;
  }
  var files = fs.readdirSync(helpersPath); //not allowing subfolders for now inside 'helpers' folder
  files.forEach(function(file) {
    if (path.extname(file) !== '.js') {
      return true;
    }
    var plugin = require(helpersPath + '/' + file)(System);
    System.plugins[plugin.register.attributes.key] = plugin.register();
    console.log('Loaded plugin: ' + file);
  });

  /**
   * Expose the auth plugin
   */
  System.auth = System.plugins.auth;

  return true;
};

/**
 * Load all files inside the models folder (mongoose models)
 * @param  {String} startingPath The starting path of the module
 * @return {Boolean}
 */
var loadDBModels = function(startingPath) {
  var modelsPath = startingPath + '/models';
  if (!fs.existsSync(modelsPath)) {
    return false;
  }
  var files = fs.readdirSync(modelsPath); //not allowing subfolders for now inside 'models' folder
  files.forEach(function(file) {
    require(modelsPath + '/' + file);
    console.log('Loaded model: ' + file);
  });
  return true;
};

/**
 * Function to load all modules in the modules directory
 * @param  {Object}   System   The main system object
 * @param  {Function} callback The callback after loading all dependencies
 * @return {Void}
 */
var loadModules = function(System, callback) {
  var list = fs.readdirSync(modulePath);
  var requires = [];

  list.forEach(function(folder) {
    var serverPath = modulePath + '/' + folder + '/server';
    var publicPath = moduleURL + '/' + folder;
    
    /**
     * Expose public paths
     */
    app.use('/' + publicPath, express.static(publicPath + '/public', options));

    /**
     * Load needed db models
     */
    loadDBModels(serverPath);

    /**
     * Require all main files of each module
     */
    var moduleFile = serverPath + '/main.js';
    if (fs.existsSync(moduleFile)) {
      requires.push(require(moduleFile));
    }
  });

  /**
   * Initiate each module by passing system to it
   */
  requires.map(function(module) {
    module(System);
  });
  
  callback();
};

/**
 * Export the object
 * @type {Object}
 */
module.exports = {

  /**
   * Dynamically loaded plugins are accessible under plugins
   * @type {Object}
   */
  plugins: {},

  /**
   * Expose the web socket connection
   * @type {Object}
   */
  webSocket: io,

  /**
   * Settings of the system
   * Populated from the DB
   * @type {Object}
   */
  settings: {},

  /**
   * Function to initialize the system and load all dependencies
   * @return {Void}
   */
  boot: function() {
    /**
     * Reference self
     * @type {Object}
     */
    var $this = this;

    /**
     * Pass the config object as is for now (TODO: reduce sensitive data)
     * @type {[type]}
     */
    this.config = Config;

    /**
     * Connect to database
     */
    dbConnect();

    /**
     * Load the helpers
     */
    loadPlugins(__dirname, this);
    
    /**
     * Finally, load dependencies and start the server
     */
    loadModules($this, function() {
      loadSettings($this, function() {
        systemRoutes($this);
        startServer();
      });
    });
  },

  /**
   * Reduced config object
   * @type {Object}
   */
  config: {},

  /**
   * The mailer object to send out emails
   * @type {Object}
   */
  mailer: {},

  /**
   * Wrapping the server's route function 
   * @param  {Array} routes The array of routes
   * @return {Void}
   */
  route: function(routes, moduleName) {
    var $this = this;

    /**
     * Module name is mandatory
     * @type {String}
     */
    moduleName = moduleName || 'unidentified';

    /**
     * Prefix each route to its module's path
     */
    routes.forEach(function(route) {
      var moduleRouter = express.Router();
      if (!route.authorized) {
        moduleRouter[route.method](route.path, $this.auth.justGetUser, function(req, res) {
          setTimeout(function() {
            route.handler(req, res);
          }, $this.config.REQUESTS_DELAY);
        });
      } else {
        moduleRouter[route.method](route.path, $this.auth.ensureAuthorized, function(req, res) {
          setTimeout(function() {
            route.handler(req, res);
          }, $this.config.REQUESTS_DELAY);
        });
      }
      app.use('/' + moduleName, moduleRouter);
    });
  }

};
var varTimeout;

io.on('disconnection', function (socket) {
  clearTimeout(varTimeout);
});

io.on('connection', function (socket) {

  var initialDataa = [
    {
      id: '420000',
      owner: {
        username: 'jtuck',
        name: 'jTuck'
      },
      timeStarted: null,
      status: 'pending',
      progress: {
        percent: 0,
        checkpoints: {
          build: {
            started: false,
            completed: false,
            success: false,
            timeCompleted: null,
            details: {},
            status: 'pending'
          },
          unit: {
            started: false,
            completed: false,
            success: false,
            timeCompleted: null,
            details: {},
            status: 'pending'
          },
          functional: {
            started: false,
            completed: false,
            success: false,
            timeCompleted: null,
            details: {},
            status: 'pending'
          }
        }
      }
    }, {
      id: '420001',
      owner: {
        username: 'jtuck',
        name: 'jTuck'
      },
      timeStarted: null,
      status: 'pending',
      progress: {
        percent: 0,
        checkpoints: {
          build: {
            started: false,
            completed: false,
            success: false,
            timeCompleted: null,
            details: {},
            status: 'pending'
          },
          unit: {
            started: false,
            completed: false,
            success: false,
            timeCompleted: null,
            details: {},
            status: 'pending'
          },
          functional: {
            started: false,
            completed: false,
            success: false,
            timeCompleted: null,
            details: {},
            status: 'pending'
          }
        }
      }
    }, {
      id: '420002',
      owner: {
        username: 'jtuck',
        name: 'jTuck'
      },
      timeStarted: null,
      status: 'pending',
      progress: {
        percent: 0,
        checkpoints: {
          build: {
            started: false,
            completed: false,
            success: false,
            timeCompleted: null,
            details: {},
            status: 'pending'
          },
          unit: {
            started: false,
            completed: false,
            success: false,
            timeCompleted: null,
            details: {},
            status: 'pending'
          },
          functional: {
            started: false,
            completed: false,
            success: false,
            timeCompleted: null,
            details: {},
            status: 'pending'
          }
        }
      }
    }, {
      id: '420003',
      owner: {
        username: 'jtuck',
        name: 'jTuck'
      },
      timeStarted: null,
      status: 'pending',
      progress: {
        percent: 0,
        checkpoints: {
          build: {
            started: false,
            completed: false,
            success: false,
            timeCompleted: null,
            details: {},
            status: 'pending'
          },
          unit: {
            started: false,
            completed: false,
            success: false,
            timeCompleted: null,
            details: {},
            status: 'pending'
          },
          functional: {
            started: false,
            completed: false,
            success: false,
            timeCompleted: null,
            details: {},
            status: 'pending'
          }
        }
      }
    }
  ];

  var data = [
    {
      id: '420000',
      owner: {
        username: 'jtuck',
        name: 'jTuck'
      },
      timeStarted: null,
      status: 'pending',
      progress: {
        percent: 0,
        checkpoints: {
          build: {
            started: false,
            completed: false,
            success: false,
            timeCompleted: null,
            details: {},
            status: 'pending'
          },
          unit: {
            started: false,
            completed: false,
            success: false,
            timeCompleted: null,
            details: {},
            status: 'pending'
          },
          functional: {
            started: false,
            completed: false,
            success: false,
            timeCompleted: null,
            details: {},
            status: 'pending'
          }
        }
      }
    }, {
      id: '420001',
      owner: {
        username: 'jtuck',
        name: 'jTuck'
      },
      timeStarted: '2015-11-29T14:27:06.208Z',
      status: 'running',
      progress: {
        percent: 65,
        checkpoints: {
          build: {
            started: true,
            completed: true,
            success: true,
            timeCompleted: '2015-11-29T14:27:06.208Z',
            details: {
              debug: {
                linkUrl: 'http://google.com',
                success: true
              },
              release: {
                linkUrl: 'http://google.com',
                success: true
              }
            },
            status: 'ok'
          },
          unit: {
            started: true,
            completed: false,
            success: false,
            timeCompleted: null,
            details: {},
            status: 'pending'
          },
          functional: {
            started: false,
            completed: false,
            success: false,
            timeCompleted: null,
            details: {},
            status: 'pending'
          }
        }
      }
    }, {
      id: '420002',
      owner: {
        username: 'jtuck',
        name: 'jTuck'
      },
      timeStarted: '2015-11-29T14:27:06.208Z',
      status: 'passed',
      progress: {
        percent: 100,
        checkpoints: {
          build: {
            started: true,
            completed: true,
            success: true,
            timeCompleted: '2015-11-29T14:27:06.208Z',
            details: {
              debug: {
                linkUrl: 'http://google.com',
                success: true
              },
              release: {
                linkUrl: 'http://google.com',
                success: true
              }
            },
            status: 'ok'
          },
          unit: {
            started: true,
            completed: true,
            success: true,
            timeCompleted: '2015-11-29T14:27:06.208Z',
            details: {
              coveragePercent: {
                covered: 58,
                notCovered: 42
              }
            },
            status: 'ok'
          },
          functional: {
            started: true,
            completed: true,
            success: true,
            timeCompleted: '2015-11-29T14:27:06.208Z',
            details: {
              coveragePercent: {
                covered: 80,
                notCovered: 20
              }
            },
            status: 'ok'
          }
        }
      }
    }, {
      id: '420003',
      owner: {
        username: 'jtuck',
        name: 'jTuck'
      },
      timeStarted: '2015-11-29T14:27:06.208Z',
      status: 'failed',
      progress: {
        percent: 0,
        checkpoints: {
          build: {
            started: true,
            completed: true,
            success: false,
            timeCompleted: '2015-11-29T14:27:06.208Z',
            details: {
              debug: {
                linkUrl: 'http://google.com',
                success: true
              },
              release: {
                linkUrl: 'http://google.com',
                success: false,
                logsUrl: 'http://google.com'
              }
            }
          },
          unit: {
            started: false,
            completed: false,
            success: false,
            timeCompleted: '2015-11-29T14:27:06.208Z',
            details: {},
            status: 'na'
          },
          functional: {
            started: false,
            completed: false,
            success: false,
            timeCompleted: '2015-11-29T14:27:06.208Z',
            details: {},
            status: 'na'
          }
        }
      }
    }
  ];
  
  // io.emit('ci-data', data);
  var initialData = [_.clone(initialDataa[0]), _.clone(initialDataa[1]), _.clone(initialDataa[2]), _.clone(initialDataa[3])];
  update1();
  update2();

  function update1() {
    var elem = initialData[2];
    var elemTo = data[2];
    elem.progress.percent = Math.min(100, elem.progress.percent+(Math.round(Math.random()*10)));
    socket.emit('ci-data', initialData);

    if (elem.progress.percent) {
      elem.timeStarted = Date.now();
      elem.progress.checkpoints.build = _.extend(elem.progress.checkpoints.build, elemTo.progress.checkpoints.build);

      elem.progress.checkpoints.unit.started = true;
      elem.status = 'running';
    }

    if (elem.progress.percent >= 45) {
      _.extend(elem.progress.checkpoints.unit, elemTo.progress.checkpoints.unit);
      elem.progress.checkpoints.unit.timeCompleted = Date.now();
    }

    if (elem.progress.percent >= 99) {
      _.extend(elem.progress.checkpoints.functional, elemTo.progress.checkpoints.functional);
      elem.status = 'passed';
    }

    if (elem.progress.percent <= 100) {
      varTimeout = setTimeout(function() {
        update1();
      }, 1000);
    }
  }

  function update2() {
    var elem2 = initialData[3];
    var elemTo2 = data[3];
    setTimeout(function() {
      _.extend(elem2, elemTo2);
      elem2.timeStarted = Date.now();
      socket.emit('ci-data', initialData);
    }, 5000);
  }
});
