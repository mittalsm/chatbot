var https = require('https');
var request = require('request');
var inArray = require("in-array");
var helper = require("./")
var requestPromise = require("request-promise");
module.exports = {
  //send every typr of messge
  send: function (messageData) {
    messageData.access_token = sails.config.messenger.pageAccessToken;
    var options = {
      uri: 'https://graph.facebook.com:443/'+ sails.config.messenger.fbApiVersion + 
      '/me/messages?access_token='+sails.config.messenger.pageAccessToken,
      method: 'POST',
      body: messageData,
      json: true
    };
    return requestPromise(options).catch((err) =>{
    });
  },
  message_id: function (messageData) {
    messageData.access_token = sails.config.messenger.pageAccessToken;
    var options = {
      uri: 'https://graph.facebook.com:443/'+ sails.config.messenger.fbApiVersion + 
      '/me/message_creatives?access_token='+sails.config.messenger.pageAccessToken,
      method: 'POST',
      body: messageData,
      json: true
    };
    request(options, (error, response, body)=>{
      var res = JSON.parse(body);
      console.log(res)
      //broadcast(res.*****)
    })
  },
  broadcast: function(token){
    var options = {
    uri: 'https://graph.facebook.com:443/'+ sails.config.messenger.fbApiVersion + 
      '/me/broadcast_messages?access_token='+sails.config.messenger.pageAccessToken,
    "message_creative_id": token,
    "notification_type": "REGULAR",
    "messaging_type": "MESSAGE_TAG",
    "tag": "NON_PROMOTIONAL_SUBSCRIPTION",
    };
    request(options)
  },
  show_every_news:function(user,category,dumm){
  url="http://api.amarujala.com/v1/"
    qs1=""
    if(category == "TOP-STORIES"){
        url = url+"home-page-sections-news"
    }
    else if(category == "TRANDING-STORIES"){
        url = url+ category.toLowerCase()
    }
    else if(category == "RECENT"){
        url = url+"recentnews/"
    }
    else{
        url= url+"recentnews/category/"+category.toLowerCase()
    }
    request({
        qs: {keywords: qs1},
        url: url,
        method: 'GET',
    },  (error, response, body)=>{
      console.log("response received");
        if(error)
            console.log("589 error");
        else
        {
            var res = JSON.parse(body);
            //if(res['news'].length != 0)
              try {
              var every_news = [];
              
              for (i=0;i<8;i++)
              {
                  every_news.push({
                              "title": res['news'][i]['Hindi-Headline'],
                              "image_url": res['news'][i]['image'].replace('150x150','300x300'),
                              "default_action": {
                                  "type": "web_url",
                                  "url": res['news'][i]['Share_URL']
                              },
                              "buttons": [{
                                  "type": "web_url",
                                  "url": res['news'][i]['Share_URL'],
                                  "title": "पढ़े "
                              }]
                      });

              }

          }
          catch(ex) {
            console.log(url)
              this.text(user,sails.config.TextMesssageFIle.gone_wrong)
          }
        }
        var messageData = {
            recipient: {
              id: user.fb_id
            },
            message: {
                "attachment": {
                          "type": "template",
                          "payload": {
                              "template_type": "generic",                        
                               "elements": every_news,                   

                              }
                          
                          }
            }
      };
      this.message_id(messageData)
    });      
    
},
  //sends a simple text message
  text: function (user, text) {
    var messageData = {
      recipient: {
        id: user.fb_id
      },
      message: {
        text: text
      }
    };
    return this.send(messageData);
  },
  //it shows that th bot is typing
  typingOn: function (recipientId, done) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      sender_action: "typing_on"
    };
    this.send(messageData,);
  },
  //if user wants to go the the website of kavya or e-paper 
  ask_for_website: function (user,text) {
    if(text=="kavya"){
      url="https://www.amarujala.com/kavya",
      text=sails.config.TextMesssageFIle.askKavya
    }
    else{
      url="http://epaper.amarujala.com/?format=img&p=today",
      text=sails.config.TextMesssageFIle.askEpaper
    }
    var messageData = {
      recipient: {
        id: user.fb_id
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: text,
            buttons: [{
              type: "web_url",
              title: "✔️हाँ ",
              url: url
            },
            {
              type: "postback",
              title: "❌नहीं ",
              payload: "no_for_website"
            }]
          }
        }
      }
    };
    this.send(messageData);
  },
  // shows quick buttons with menu
  menu:function (user,text){
    console.log("entering menu")
    var quick_replies=[];
    for(let index in sails.config.menu_string.main_menu_string){
      menu_item = sails.config.menu_string.main_menu_string[index];
      quick_replies.push({
        "content_type":"text",
        "title":menu_item.title_hn,
        "payload":menu_item.payload,
        "image_url": menu_item.image_url
      
      });
    }
    var messageData = {
      recipient: {
        id: user.fb_id
      },
      message: {
        "text" : text,
        "quick_replies" : quick_replies
      }
    };
    //console.log(quick_replies)
    this.send(messageData);
  },
  //if the user wants to change the time of getting news
  select_when_news:function(user,text){
    var quick_replies=[]
    for(var i =0; i<sails.config.arrayList.times_a_day_eng.length;i++){
      quick_replies.push({
        "content_type":"text",
            "title":sails.config.arrayList.times_a_day_hin[i],
            "payload":sails.config.arrayList.times_a_day_eng[i],
            "image_url":sails.config.ImageUrl.timeImageurl          
      });
    }
    var messageData = {
            recipient: {
              id: user.fb_id
            },
            message: {"text" : text,
        "quick_replies" : quick_replies
            }
          };
          this.send(messageData);
    
},
  
//this function gives user the 3 options from which user can select the time for news feeds e.g once a day
select_time: function(user,time){
  if(inArray(sails.config.arrayList.times_a_day_eng ,time )){
    this.choose_time(user,sails.config.TextMesssageFIle.choose_time,sails.config.arrayList[time]);
  }
},
//gives the pushbutton with time written on it
choose_time:function(user,text,time){
 var quick_replies=[];
  for(let i=0;i<time.length;i++){
    quick_replies.push({
      "content_type":"text",
      "title":time[i],
      "payload":time[i],
      "image_url": sails.config.ImageUrl.timeImageurl
  })
  }
  var messageData = {
      recipient: {
        id: user.fb_id
      },
      message: {
        "text" : text,
        "quick_replies" : quick_replies
      }
    };
    this.send(messageData);
  },
// if user wants to share the bot with friends  
share_bot_template:function(user,text){
  var messageData = {
      recipient: {
        id: user.fb_id
      },
      message: {
        "attachment":{
            "type":"template",
            "payload":{
                "template_type":"generic",
                "elements":[
                     {
                      "title": text,
                      "image_url":sails.config.ImageUrl.shareBotImage,
                      buttons:[{
                        type: "element_share",
                            }]
                            
                    }
                  ]
            }
        }
      }
    };
    this.send(messageData);
},
// ask user for subscription after sending the news
ask_subscription:function(user,text,payload_value){
  var messageData = {
      recipient: {
        id: user.fb_id
      },
      message: {
        "attachment":{
            "type":"template",
            "payload":{
                "template_type":"button",
                "text": text,
                "buttons":[
                    {
                        "type":"postback",
                        "title":"सब्सक्राइब",
                        "payload":payload_value+'_subscribe',
                    }
                ]
            }
        }
      }
    };
    this.send(messageData);
},
howToUnsubscribe:function(user,question,payload){
  var messageData = {
    recipient: {
      id: user.fb_id
    },
    message:{
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"button",
          "text":question,
          "buttons":[
            {
              "type":"postback",
              "title":"सभी से",
              "payload":"unsubscribe_all",
            },
            {
              "type":"postback",
              "title":"अलग अलग",
              "payload":"manage_individual",
            }
          ]
        }
      }
    }
  };
this.send(messageData);
},
unsubscribeIndividual:function(user){
  var arr=user.category.filter((x)=>x.is_subscribed).map((x)=>x.title_hn);
  var arr2=user.category.filter((x)=>x.is_subscribed).map((x)=>x.payload);
  console.log("length= "+ arr.length + arr2.length)
  for(i=0;i<arr.length;i++){
  var messageData = {
      recipient: {
        id: user.fb_id
      },
      message:{
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"button",
          "text":arr[i],
          "buttons":[
            {
              "type":"postback",
              "title":"अनसब्सक्राइब",
              "payload":"unsubs_"+arr2[i],
            }
          ]
        }
      }
    }
    };
    this.send(messageData);
  }
},
//this sends every type of news in generic template
show_every_news_genericView:function(user,category,dumm){
  url="http://api.amarujala.com/v1/"
    qs1=""
    if(category == "TOP-STORIES"){
        url = url+"home-page-sections-news"
    }
    else if(category == "TRANDING-STORIES"){
        url = url+ category.toLowerCase()
    }
    else if(category == "RECENT"){
        url = url+"recentnews/"
    }
    else if(category == "keyword"){
        url = url +"search/"
        qs1= dumm
    }
    else{
        url= url+"recentnews/category/"+category.toLowerCase()
    }
    request({
        qs: {keywords: qs1},
        url: url,
        method: 'GET',
    },  (error, response, body)=>{
      console.log("response received");
        if(error)
            console.log("589 error");
        else
        {
            var res = JSON.parse(body);
            //if(res['news'].length != 0)
              try {
              var every_news = [];
              
              for (i=0;i<8;i++)
              {
                  every_news.push({
                              "title": res['news'][i]['Hindi-Headline'],
                              "image_url": res['news'][i]['image'].replace('150x150','300x300'),
                              "default_action": {
                                  "type": "web_url",
                                  "url": res['news'][i]['Share_URL']
                              },
                              "buttons": [{
                                  "type": "web_url",
                                  "url": res['news'][i]['Share_URL'],
                                  "title": "पढ़े "
                              }]
                      });

              }

          }
          catch(ex) {
            console.log(url)
              this.text(user,sails.config.TextMesssageFIle.gone_wrong)
          }
        }
        var messageData = {
            recipient: {
              id: user.fb_id
            },
            message: {
                "attachment": {
                          "type": "template",
                          "payload": {
                              "template_type": "generic",                        
                               "elements": every_news,                   

                              }
                          
                          }
            }
      };
      this.send(messageData)
      .then((res)=>{
        if(category!="keyword"){
        if(!helper.subscribed(user,category)){
          this.askForSubscription(user,sails.config.TextMesssageFIle.ask_subscribe,category)
        }
      }
      });
    });      
    
},
askForSubscription: function(user,question,payload_value){
  var messageData = {
    recipient: {
      id: user.fb_id
    },
    message: {
      "attachment":{
          "type":"template",
          "payload":{
              "template_type":"button",
              "text": question,
              "buttons":[
                  {
                      "type":"postback",
                      "title":"✔️हाँ ",
                      "payload":"subscribed_"+ payload_value,
                  },
                  {
                      "type":"postback",             
                      "title":"❌नहीं ",
                      "payload":"no_for_website"
                  }
              ]
          }
      }
    }
  };
  this.send(messageData);
}
}