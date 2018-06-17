var mongoose=require("mongoose");
var db=require("./db.js");
var ObjectID = require('mongodb').ObjectID;

//结构
var userSchema=new mongoose.Schema({
	username : {type:String},
	password : {type:String}
})

//通过name找密码
userSchema.statics.findbookbyName=function(name,callback){
	this.model("User").findOne(name,callback)
}


//找所有书
userSchema.statics.suoyoushu=function(callback){
	this.model("User").find({},callback)
}


//通过id找
userSchema.statics.findbookbyid=function(uid,callback){
	this.model("User").find({_id:ObjectID(uid)},callback)
}

//更新修改
userSchema.statics.updatebookbyid=function(uid, newdate,callback){
	this.model("User").update({_id:new ObjectID(uid)}, newdate,callback)
}

//删除
userSchema.statics.removebook=function(uid,callback){
	this.model("User").remove({_id:ObjectID(uid)},callback)
}


//模型，把schema转化为model
var userModel=db.model('User',userSchema);

module.exports=userModel;


