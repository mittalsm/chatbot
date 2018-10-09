var sendAPI = require("./sendAPI");
var node_cron = require('node-cron');
var croning = {
	//send news  to the subscribed user
	sendNews:function(user){
                if(user.is_subscribe==true){
                        var arr=user.category.filter((x)=>x.is_subscribed).map((x)=>x.payload);
                        console.log(arr)
                        var arr2=user.category.filter((x)=>x.is_subscribed).map((x)=>x.title_hn);
                        for(j=0;j<arr.length;j++){
                                sendAPI.show_every_news(user,arr[j],"")
                        }
                }
        }
}

module.exports={
	//every 1st minute of written hours cron starts
        job:node_cron.schedule("1 7,13,20 * * *",()=>{
		console.log("cron started");
                query={is_subscribe:true}
                User.find(query).exec((err, res)=>{
                        if (err) throw err;
                        else{
                                for(k=0;k<res.length;k++){
                                croning.sendNews(res[k])
                                }
                        }
	        });
})
}

