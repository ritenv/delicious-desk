var myController = require('../controllers/links');
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
    handler: ctrl.list,
    authorized: false
  });

  routes.push({
    method: 'delete',
    path: '/',
    handler: ctrl.delete,
    authorized: true
  });

  routes.push({
    method: 'post',
    path: '/upload-document',
    handler: ctrl.uploadDocument,
    authorized: true
  });


  return routes;
};