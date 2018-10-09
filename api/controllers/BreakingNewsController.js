/**
 * Breaking news
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var sendAPI = require('../helpers/sendAPI');
var request = require('request');

	
module.exports = {
	breaking_news: function(req,res){
		if(req.query['hub.verify_token'] === sails.config.messenger.validationToken){
		res.ok("broadcasted to users")
  		request({
        url:"http://api.amarujala.com/v1/breaking-news",
        method: 'GET',
    },function(error, response, body){
        if(error)
        {
            console.log("589 error");
        }
        else
        {

        	var apilink = JSON.parse(body);
        	if(!apilink['news'][0]['link_url']==""){
        		uri=apilink['news'][0]['link_url']
	            request({
		        url:uri,
		        method: 'GET',
			    },function(error, response, body){
			        if(error)
			        {
			            console.log("589 error");
			        }
			        else
			        {
			            var res = JSON.parse(body);
			            brk_news=[];
			            brk_news.push({
	                        "title": res['news'][0]['Hindi-Headline'],
	                        "image_url":"testbot.amarujala.com/images/breakingnews.png",
	                        "default_action": {
	                            "type": "web_url",
	                            "url": res['news'][0]['Share_URL']
	                        },
	                        "buttons": [{
	                            "type": "web_url",
	                            "url": res['news'][0]['Share_URL'],
	                            "title": "पढ़े "
	                        }]
                		});
                		User.find().exec((err, user)=>{
					        if (err) throw err;
					        for(l=0;l<user.length;l++){
					        	var messageData = {
					            recipient: {
					              id: user[l].fb_id
					            },
					            message:{
					                "attachment": {
					                          "type": "template",
					                          "payload": {
					                              "template_type": "generic",                        
					                               "elements": brk_news,                   

					                              }
					                          
					                          }
					            }
					          };
					          sendAPI.send(messageData)
					        }
				});
			        }

			    });
        	}
        	
        }

    });
  }
  	}  	
};

