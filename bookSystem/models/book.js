var mongoose=require("mongoose");
var db=require("./db.js");
var ObjectID = require('mongodb').ObjectID;

//结构
var bookSchema=new mongoose.Schema({
	name : {type:String},
	author : {type:String},
	price  :  {type:Number},
	type  :  {type:Array,"default":""}
})

//找所有书
bookSchema.statics.suoyoushu=function(callback){
	this.model("Book").find({},callback)
}


//通过id找书,接收书名和回调函数
bookSchema.statics.findbookbyid=function(uid,callback){
	this.model("Book").find({_id:ObjectID(uid)},callback)
}

//更新修改
bookSchema.statics.updatebookbyid=function(uid, newdate,callback){
	this.model("Book").update({_id:new ObjectID(uid)}, newdate,callback)
}

//删除
bookSchema.statics.removebook=function(uid,callback){
	this.model("Book").remove({_id:ObjectID(uid)},callback)
}


//模型，把schema转化为model
var bookModel=db.model('Book',bookSchema);

module.exports=bookModel;