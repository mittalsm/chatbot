/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var languages = require('../utils/languages').map(function(lang){
  return lang.fb;
});

module.exports = {
  connection:'MongodbServer',
  attributes: {
    fb_id: {
      type: "string",
      required: true,
      unique: true,
      index: true
    },
    first_name: {
      type: "string",
      required: true
    },
    last_name: {
      type: "string",
      required: true
    },
    profile_pic: {
      type: "string",
      required: true
    },
    locale: {
      type: "string",
      enum: languages
    },
    timezone: {
      type: "integer"
    },
    gender: {
      type: "string"
    },
    is_subscribe: {
      type: "boolean"
    },
    category: {
      type: "array",
      required: false
    },
    time: {
      type: "array",
      required: false
    }

  },
  createFromFb: function (id, cb) {
    https = require('https');
    var options = {
      hostname: 'graph.facebook.com',
      port: 443,
      path: '/' + sails.config.messenger.fbApiVersion + '/' + id + '?access_token=' + sails.config.messenger.pageAccessToken,
      method: 'GET'
    };

    var req = https.request(options, function (res) {
      var body = '';
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        body += chunk;
      });
      res.on('end', function () {
        var fbUser = JSON.parse(body);
        fbUser.fb_id = id;
        //User.create({fbUser,category:[],time:[]})
        User.create({...fbUser,category:[],time:[],is_subscribe:0})
            .exec(function (err, user) {
              if (err)
                return cb(err, null);
              cb(null, user);
            });
      });
    });
    req.on('error', function (err) {
      return cb(err, null);
    });
    req.end();
  }
};

