//不关心数据库，只操作对象
var Book=require("../models/book.js");


//显示首页
exports.showIndex = function(req,res,next){
	Book.suoyoushu(function(err,result){
		if(err){
			console.log(err)
		}
	   res.render("index",{
	   	"tushu":result
	   });
	})
}


//addbook页面显示
exports.addbook = function(req,res,next){
   res.render("addbook");
}


//提交增加book
exports.doadd = function(req,res,next){
   Book.create(req.query,function(err){
   	if(err){
   		res.send("失败！")
   	}
   	res.send("保存成功！")
   })
}



//修改显示
exports.edit = function(req,res,next){
	Book.findbookbyid(req.query.id,function(err,result){
		res.render("edit",result[0]);
	})
}


//提交修改
exports.doedit = function(req,res,next){
	 // res.send('参数:'+req.query.id+'/'+req.query.name+'/'+req.query.author+'/'+req.query.price)
    var newdate= {$set:{name:req.query.name,author:req.query.author,price:req.query.price}};
	var options = {new : true};
	Book.updatebookbyid(req.query.id,newdate,function(err,result){
        if(err){
   		  res.send("修改失败！")
	   	}
	    res.send(result)
	})
}


//删除
exports.dodelet = function(req,res,next){
	Book.removebook(req.query.id,function(err,result){
        if(err){
   		  res.send("删除失败！")
	   	}
        res.redirect('/');
	})
}