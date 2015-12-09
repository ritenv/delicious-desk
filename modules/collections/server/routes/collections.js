var myController = require('../controllers/collections');
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
    method: 'post',
    path: '/attach',
    handler: ctrl.attach,
    authorized: true
  });

  routes.push({
    method: 'get',
    path: '/',
    handler: ctrl.list,
    authorized: true
  });

  routes.push({
    method: 'delete',
    path: '/',
    handler: ctrl.delete,
    authorized: true
  });


  return routes;
};