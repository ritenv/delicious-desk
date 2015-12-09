'use strict';

/**
 * Module dependencies.
 */
var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema,
    crypto    = require('crypto'),
          _   = require('lodash');

/**
 * Getter
 */
var escapeProperty = function(value) {
  return _.escape(value);
};

/**
 * Post Schema
 */

var LinksSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  creator: {
    type: Schema.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: true,
    get: escapeProperty
  },
  description: {
    type: String,
    required: false,
    get: escapeProperty
  },
  linkType: {
    type: String,
    required: true,
    get: escapeProperty
  },
  url: {
    type: String,
    required: true,
    get: escapeProperty
  },
  defaultInAll: {
    type: Boolean,
    default: false
  },
  tags: {
    type: [String],
    required: false
  }
});

/**
 * Methods
 */
LinksSchema.methods = {
  /**
   * Hide security sensitive fields
   * 
   * @returns {*|Array|Binary|Object}
   */
  toJSON: function() {
    var obj = this.toObject();
    if (obj.creator) {
      delete obj.creator.token;
      delete obj.creator.hashed_password;
      delete obj.creator.salt;
      delete obj.creator.following;
    }
    if (obj.likes) {
      obj.likeCount = obj.likes.length;
    } else {
      obj.likeCount = 0;
    }
    return obj;
  }
};

mongoose.model('Link', LinksSchema);
