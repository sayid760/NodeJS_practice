var mongoose=require("mongoose");
var db=require("./db.js");
var ObjectID = require('mongodb').ObjectID;

//结构
var cartSchema=new mongoose.Schema({
	uId: { type: String },
    cId: { type: String },
    cName: { type: String },
    cPrice: { type: String },
    cImgSrc: { type:String } ,
    cQuantity: { type: Number },
    cStatus : { type: Boolean, default: false  }
})


//通过条件找
cartSchema.statics.findcartgoods=function(conditions,callback){
	this.model("Cart").find(conditions,callback)
}

//返回一个对象
cartSchema.statics.findOnecartgoods=function(conditions,callback){
	this.model("Cart").findOne(conditions,callback)
}

//删除商品
cartSchema.statics.removeCartgoods=function(conditions,callback){
	this.model("Cart").remove(conditions,callback)
}

//更新商品
cartSchema.statics.updateCartgoods=function(conditions,newdate,callback){
	this.model("Cart").update(conditions, newdate,callback)
}

//模型，把schema转化为model
var cartModel=db.model('Cart',cartSchema);

module.exports=cartModel;


