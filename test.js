// var  a=[1,2,3,4];
// console.log("first "+a)
// // a=[4,5,3]
// //console.log("second "+a)
// function test(){
// 	a=[3,7,6]
// 	console.log("function "+a)
// }
// test()
// console.log("second "+a)
var cron= require("node-cron")
var fs= require('fs')

cron.schedule("*/5 * * * * *",()=>{
	console.log('running')
	var a="kl"
	fs.appendfile(a+".txt",'qwqeqoaodjsodzkjioasdso',function(err,data){
		if (err){
			console.log("error")
		}
		else{
			console.log("saved")
		}
	})
})