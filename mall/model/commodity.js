var mongoose=require("mongoose");
var db=require("./db.js");
var ObjectID = require('mongodb').ObjectID;

//结构
var commoditySchema=new mongoose.Schema({
	name : {type:String},
	price : {type:Number},
	imgSrc: {type:String}
})

//找所有商品
commoditySchema.statics.findgoods=function(callback){
//	this.model("Commodity").find({},callback)
	this.model("Commodity").find({},callback);
}

commoditySchema.statics.findOnegoods=function(conditions,callback){
	this.model("Commodity").findOne(conditions,callback)
}

//模型，把schema转化为model
var commodityModel=db.model('Commodity',commoditySchema);

module.exports=commodityModel;


