/***********************************************************************
It is a helper file with different functions that manages database work.
***********************************************************************/

var inArray = require("in-array");

module.exports={
	//update null array as the subscribed categories

	addcategory:function(user,category){
			var arr=user.category.map(function (x){return x.payload})
			query={fb_id:user.fb_id};
			if(!inArray(arr,category.payload)){
				category.is_subscribed = 1;
				cat = [...user.category,category]
				new_value={category:cat,is_subscribe:1};			
				User.update(query,new_value).exec(function(err,res){
					if(err) throw err;
					else{
						console.log("array updated")
					}
				});
			}
			else if(inArray(arr,category.payload)){
				i=user.category.map((x)=>x.payload).indexOf(category.payload);
				console.log(i)
				user.category[i].is_subscribed = 1;
				cat=user.category;
				new_value={category:cat,is_subscribe:1};			
				User.update(query,new_value).exec(function(err,res){
					if(err) throw err;
					else{
						console.log("array updated")
					}
				});
			}
			
	},	
	//update time for the user of getting news
	updateTime:function(user,time){	
		query={fb_id:user.fb_id};
		if(time.length=="3"){
		new_value={time:sails.config.arrayList[time]};
		console.log(sails.config.arrayList[time].length)
		}
		else if(time.length=="9" || time.length=="10"){
		new_value={time:sails.config.arrayList[time]};
		console.log(sails.config.arrayList[time].length)
		}
		else{
			new_value={time:sails.config.arrayList[time]};
			console.log(sails.config.arrayList[time].length)
		}
		User.update(query,new_value).exec(function(err,res){
			if(err) throw err;
			else{
				console.log("updated")
			}
		})
	},
	//check if the user has already subscribed for the category
	subscribed:function(user,category){
		var arr=user.category.filter((x)=>x.is_subscribed).map((x)=>x.payload);
		if(inArray(arr,category)){
			return true
		}
	},
	//if user wants to unsubscribe for all categories
	unsubscribe:function(user,payload){
		query={fb_id:user.fb_id};
		// User.find(query).exec(function(err,res){
		// 	if(err) throw err;
			// cat=user.category.map(function (x){x.is_subscribed=0;return x;})
			// new_value={is_subscribe:0,category:cat};
			new_value={is_subscribe:0};
			User.update(query,new_value).exec(function(err,res){
			if(err) throw err;
			else{
				console.log("array is now null")
			}
				})
		//})
	},
	unsubscribeIndividual:function(user,category){
		i=user.category.map((x)=>x.payload).indexOf(category);
		query={'fb_id':user.fb_id};
		new_value={$set:{"category.$.is_subscribed":false}};
		user.category[i].is_subscribed=0;
		cat =user.category;
		new_value={category:cat}
		User.update(query,new_value).exec(function(err,res){
					if(err) throw err;
					else{
						console.log("array updated")
					}
				});
		
	},
	//if user wants to see the subscribed categories
	checkSubscription: function(user,payload){
		if(user.is_subscribe==false){
			return false
		}
		var arr=user.category.filter((x)=>x.is_subscribed).map(function (x){return x.payload})
		if(arr.length==0) return false
		else return true
	},
	showCategory:function(user,payload){
		return user.category.filter((x)=>x.is_subscribed).map((x)=>x.title_hn).join("\n");
	}
}

// if(arr.length==0){
// 				console.log("array was null so this happened")
// 				arr=[];
// 				arr.push(category)
// 				category.is_subscribed=1;
// 				query={fb_id:user.fb_id};
// 				new_value={category:arr,is_subscribe:1};			
// 				User.update(query,new_value).exec(function(err,res){
// 				if(err) throw err;
// 				else{
// 					console.log("array updated")
// 				}
// 					})
// 			}
// 			else{
// 				console.log("array was not null so this happened")
// 				var arr=user.category.map(function (x){return x.payload})
// 				query={fb_id:user.fb_id};
// 				if(!inArray(arr,category.payload)){
// 					category.is_subscribed = 1;
// 					cat = [...user.category,category]
// 					console.log(cat)
// 					new_value={category:cat,is_subscribe:1};			
// 					User.update(query,new_value).exec(function(err,res){
// 						if(err) throw err;
// 						else{
// 							console.log("array updated")
// 						}
// 					});
// 				}
// 			}

//unsubscribe:function(user,payload){
	// 	query={fb_id:user.fb_id};
	// 	User.find(query).exec(function(err,res){
	// 		if(err) throw err;
	// 		new_value={};
	// 		User.update(query,new_value).exec(function(err,res){
	// 		if(err) throw err;
	// 		else{
	// 			console.log("array is now null")
	// 		}
	// 			})
	// 	})
	// },