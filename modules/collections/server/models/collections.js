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

var CollectionsSchema = new Schema({
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
  introText: {
    type: String,
    required: true,
    get: escapeProperty
  },
  criticalText: {
    type: String,
    required: true,
    get: escapeProperty
  },
  password: {
    type: String,
    required: false,
    get: escapeProperty
  },
  identifier: {
    type: String,
    required: false,
    get: escapeProperty
  },
  attachments: [{
    type: Schema.ObjectId,
    required: false,
    ref: 'Link'
  }],
  links: {
    guideLinks: [String],
    documentLinks: [String],
    videoLinks: [String],
    safetyLinks: [String]
  }
});

/**
 * Methods
 */
CollectionsSchema.methods = {
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

mongoose.model('Collection', CollectionsSchema);
