var node_cron = require('node-cron');
console.log("file included")
module.exports={
	//every 1st minute of written hours cron starts
	job:node_cron.schedule("* * * * * *",()=>{

		var current_hour = (new Date()).getHours()
		var current_hour_check = "'"+current_hour+"'"
		console.log(current_hour_check)
		User.find({time : {'contains' : current_hour_check}})
		.exec((err, res)=>{
        if (err) throw err;
        else{
        	console.log(res)
        }
    });
   	})
}