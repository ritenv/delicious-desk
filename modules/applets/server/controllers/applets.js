var mongoose = require('mongoose');
var Applet = mongoose.model('Applet');

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