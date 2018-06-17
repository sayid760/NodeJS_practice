var mongoose=require('mongoose');
//创建数据库连接
var db=mongoose.createConnection('mongodb://localhost:27017/test');

//监听open事件
db.once('open',function(callback){
	console.log("数据库连接成功")
})

module.exports=db;