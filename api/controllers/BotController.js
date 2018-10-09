/**
 * BotController
 *
 * @description :: Server-side logic for managing bots
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var inArray = require("in-array");
var sendAPI = require('../helpers/sendAPI');
var helper = require('../helpers');
var cronWork = require('../helpers/cronWork');


var fallback = function (err, info) {
  sails.log.info(new Date());
  if (err)
    return sails.log.error(err);
  return sails.log.info(info);
};
var reportError = function (user, err) {
  if (err) {
    sails.log.error(err);
    return sendAPI.reportError(user, err, fallback);
  }
};

var unreconizedCall = function (user, type, value) {
  sails.log.warn("Recieved unkown `" + type + "`:");
  sails.log.info(value);
};

module.exports = {
  subscribe: function (req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === sails.config.messenger.validationToken) {
      sails.log.info("Validating webhook");
      //console.log("validating webhook");
      res.ok(req.query['hub.challenge']);
    } else {
      sails.log.error("Failed validation. Make sure the validation tokens match.");
      res.ok("WELCOME TO AMARUJALA. (Failed validation)")
      //res.forbidden({ err: "Failed validation." });
    }
  },
  webhook: function (req, res) {
    var data = req.allParams();
    data.entry.forEach(function (entry) {
      entry.messaging.forEach(function (messaging) {
        getUser(messaging.sender, function (err, user) {
          if (err){
            console.log("error")
            return sails.log.error(err);
          }
          if (messaging.message) {
            console.log("in message handler ");
            if(messaging.message.quick_reply){
            message=messaging.message.quick_reply;
            return handlePayload(user, message.payload);
            }
            else if(messaging.message.attachments){
              return handleAttachments(user)
            }
            else{
             message=messaging.message;
             return handleMessage(user, message.text, message.nlps);
            }
          
          } 
          else if (messaging.postback) {
            console.log("in payload handler "+ messaging.postback.payload)
            return handlePayload(user, messaging.postback.payload);
          }

        });
      });
    });
    res.ok();
  }
};

var getUser = function (sender, cb) {
  if (!sender)
    cb('can not find sender', null);
  User.findOne({ fb_id: sender.id })
    .exec(function (err, user) {
      if (err)
        cb(err, null);
      if (!user) {
        User.createFromFb(sender.id, function (err, user) {
          if (!err)
            cb(err, user);
        });
      } else {
        cb(null, user);
      }
    });
};

/*
 * Postback Event
 *
 * This event is called when a postback is tapped on a Structured Message. 
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
 * 
 */
var handlePayload = function (user, payload) {
  sendAPI.typingOn(user.fb_id,()=>{});
  console.log("entering payload  handler => "+ payload)
  if(payload == "GET_STARTED" || payload == "Get Started" ){
    sendAPI.text(user,sails.config.TextMesssageFIle.greeting).then((res)=>{
      sendAPI.menu(user,sails.config.TextMesssageFIle.withmenu);
    })
    
  }
  else if(payload == "top_stories"){
    sendAPI.show_every_news_genericView(user,sails.config.arrayList.menu_string_eng[0]);
  }
  else if(payload === "menu"){
        sendAPI.menu(user,sails.config.TextMesssageFIle.withmenu);
    }
  else  if (payload === 'mang_time'){
    sendAPI.select_when_news(user,sails.config.TextMesssageFIle.ask_timing)
  }
  else if(payload === "no_for_website"){
    sendAPI.text(user,sails.config.TextMesssageFIle.no_problem).then((res)=>{
      console.log(res)
        sendAPI.menu(user,sails.config.TextMesssageFIle.withmenu);
      });
  }
  else if (payload === 'share_bot'){
      sendAPI.share_bot_template(user,sails.config.TextMesssageFIle.ask_friend_to_join);
  }

  else if(inArray(sails.config.arrayList.user_subscribed_category,payload)){
    sendAPI.text(user,sails.config.TextMesssageFIle.subscribed)
    var index = sails.config.arrayList.user_subscribed_category.indexOf(payload);
    var category = sails.config.menu_string.main_menu_string[index]
    helper.addcategory(user,category);
  }
  else if(payload=='unsubscribe'){
    if(user.is_subscribe==1){
    sendAPI.howToUnsubscribe(user,sails.config.TextMesssageFIle.how_to_unsubscribe,payload);
    }
    else{
      sendAPI.text(user,sails.config.TextMesssageFIle.not_subscribed)
    }
  }
  else if(payload=="unsubscribe_all"){
    sendAPI.text(user,sails.config.TextMesssageFIle.unsubscribed);
    helper.unsubscribe(user,payload);
  }
  else if(payload=="manage_individual"){
    sendAPI.unsubscribeIndividual(user);
  }
  else if(inArray(sails.config.arrayList.user_unsubscribed,payload)){
    sendAPI.text(user,sails.config.TextMesssageFIle.unsubscribed);
    var index = sails.config.arrayList.user_unsubscribed.indexOf(payload);
    var category = sails.config.arrayList.menu_string_eng[index];
    helper.unsubscribeIndividual(user,category)
  }
  else if(payload=='check_subscriptions'){
    if(helper.checkSubscription(user,payload)){
      arr=helper.showCategory(user,payload)
      sendAPI.text(user,sails.config.TextMesssageFIle.subscribed_categories_are+arr)
    }
    else{
      sendAPI.text(user,sails.config.TextMesssageFIle.not_subscribed)
    }
  }
  else{
    handleMessagePayload(user,payload);
  }

  
}
/*********************************************************************************************
 * Implement your logic for message that is recieved here
 * The message is either a text or an attachement
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received 
 *********************************************************************************************/
var handleMessage = function (user, text, attachment) {
  sendAPI.typingOn(user.fb_id,()=>{});
  console.log("entering messages handler =>" + text)
  if(text.toLowerCase()=="menu"){
    sendAPI.menu(user,sails.config.TextMesssageFIle.withmenu);
  }
  else if(inArray(sails.config.arrayList.hey_string ,text.toLowerCase() )){
    sendAPI.text(user,sails.config.TextMesssageFIle.greeting).then((res)=>{
      sendAPI.menu(user,sails.config.TextMesssageFIle.withmenu);
    })
    
  }
  else if(inArray(sails.config.arrayList.no_string ,text.toLowerCase() )){
    sendAPI.menu(user,sails.config.TextMesssageFIle.withmenu);
  }
  
  else {
    sendAPI.show_every_news_genericView(user,"keyword",text)
  }
}


//handles quick replies with there payload
//payload == payload of quick buttuns
var handleMessagePayload = function(user, payload) {
  sendAPI.typingOn(user.fb_id,()=>{});
  console.log("the quickbutton clicked is having payload: "+ payload);
  if(payload=='kavya' || payload== 'e_paper'){
    sendAPI.ask_for_website(user,payload,()=>{});
  }
  else if(inArray(sails.config.arrayList.menu_string_eng ,payload)){
    sendAPI.show_every_news_genericView(user,payload,"");
  }
  else if(inArray(sails.config.arrayList.times_a_day_eng ,payload)){
    sendAPI.select_time(user,payload)
  }
  else if(inArray(sails.config.arrayList.choose_time_array ,payload)){
    helper.updateTime(user,payload)
    sendAPI.text(user,sails.config.TextMesssageFIle.time_set)
  }
  
}


// for handling any type of attachments
var handleAttachments = function (user) {
    sendAPI.text(user,sails.config.TextMesssageFIle.thanks_for_sending)
}

