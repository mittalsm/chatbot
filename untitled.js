send: function (messageData, cb) {
    messageData.access_token = sails.config.messenger.pageAccessToken;
    var data = JSON.stringify(messageData);
    var options = {
      hostname: 'graph.facebook.com',
      port: 443,
      path: '/' + sails.config.messenger.fbApiVersion + '/me/messages',
      qs: { access_token: sails.config.messenger.pageAccessToken },
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    // return requestPromise({

    // })
    var req = https.request(options, function (res) {
      var body = '';
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        body += chunk;
      });
      res.on('end', function () {
        var message = JSON.parse(body);
        if (!message)
          return cb('error while parsing json response, response was : ' + body, null);
        if (message.error)
          return cb(message,null);
        return cb(null, message);
      });
    });
    req.on('error', function (err) {
      return sails.log.error(err);
    });
    req.write(data);
    req.end();
   
  },










  .create({
              sender: user,
              entry: entry.id,
              text: messaging.message.text,
              attachments: messaging.message.attachments,
              payload: messaging.message.quick_reply ? messaging.message.quick_reply.payload : null,
              nlps: messaging.message.nlp
            })





  attributes: {
    sender: {
      type: "string",
      required: true,
      // unique: true,
      // index: true
    },
    category: {
      type: "string",
      required: false
    },
    time: {
      type: "string",
      required: false
    }
    
  },




  var getUser = function (sender, cb) {
  if (!sender)
    cb('can not find sender', null);
  User.findOne({ sender: ""+sender.id })
    .exec(function (err, user) {
      if (err)
        cb(err, null);
      if (!user) {
        User.create({sender: "ok",time:"okfdf",category:"fakdfd"}).exec(function (err, user) {
          if (!err)
            console.log("error in creating user");
          else
            console.log
            
        });
      } else {
        cb(null, user);
      }
    });
};






module.exports = {
  subscribe: function (req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === sails.config.messenger.validationToken) {
      sails.log.info("Validating webhook");
      res.ok(req.query['hub.challenge']);
    } else {
      sails.log.error("Failed validation. Make sure the validation tokens match.");
      res.forbidden({ err: "Failed validation. Make sure the validation tokens match." });
    }
  },
  webhook: function (req, res) {
    var data = req.allParams();
    data.entry.forEach(function (entry) {
      entry.messaging.forEach(function (messaging) {
        getUser(messaging.sender, function (err, user) {
          if (err)
            return sails.log.error(err);
          if (messaging.message) {
            console.log("in message handler")
            // The boilerplate save all messages by default
            return Message.create({
              sender: user,
              entry: entry.id,
              text: messaging.message.text,
              attachments: messaging.message.attachments,
              payload: messaging.message.quick_reply ? messaging.message.quick_reply.payload : null,
              nlps: messaging.message.nlp
            }).exec(function (err, message) {
              if (err)
                return sails.log.error(err);
              if (message.payload)
                return handlePayload(user, message.payload);
              if (message.text)
                if (message.attachments)
                  return handleFallback(user, message.text, message.attachments);
                else
                  return handleMessage(user, message.text, message.nlps);
              if (message.attachments)
                return handleAttachments(user, message.attachments);
              return unreconizedCall(user, "messaging.message", message);
            });
          } else if (messaging.postback) {
            console.log("in postback hander")
            return handlePayload(user, messaging.postback.payload);
          }else
            return unreconizedCall(user, "messaging", messaging);
        });
      });
    });
    res.ok();
  }
};






webhook: function (req, res) {
    var data = req.allParams();
    data.entry.forEach(function (entry) {
      entry.messaging.forEach(function (messaging) {
        getUser(messaging.sender, function (err, user) {
          if (err)
            return sails.log.error(err);
          if (messaging.message) {
            // The boilerplate save all messages by default
            //return Message.exec(function (err, message) {
              if (err){
                return sails.log.error(err);
              }
              // if (messaging.message.payload){
              //   console.log("running occasinaly")
              //   return handlePayload(user, messaging.message.payload);
              // }
              if (messaging.message.text){
                if (messaging.message.attachments){
                  console.log("attachment")
                  return handleFallback(user, messaging.message.text, messaging.message.attachments);
                }
                else
                  return handleMessage(user, messaging.message.text, messaging.message.nlps);
              }
            //});
          } else if (messaging.postback) {
            return handlePayload(user, messaging.postback.payload);
          } 
        });
      });
    });
    res.ok();
  }
};