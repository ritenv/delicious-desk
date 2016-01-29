var myController = require('../controllers/applets');
/**
 * Init the controller
 */
module.exports = function(System) {
  var ctrl = myController(System);

  var routes = [];
  
  routes.push({
    method: 'post',
    path: '/',
    handler: ctrl.create,
    authorized: true
  });

  routes.push({
    method: 'get',
    path: '/',
    handler: ctrl.feed,
    authorized: true
  });

  routes.push({
    method: 'get',
    path: '/resources',
    handler: ctrl.elastic,
    authorized: false
  });

  routes.push({
    method: 'get',
    path: '/resources/:documentType',
    handler: ctrl.elastic,
    authorized: false
  });

  return routes;
};