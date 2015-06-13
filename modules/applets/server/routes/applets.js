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


  return routes;
};