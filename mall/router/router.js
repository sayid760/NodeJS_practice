//不关心数据库，只操作对象
var User=require("../model/user.js");
var Commodity=require("../model/commodity.js");
var Cart=require("../model/cart.js");
var md5 = require("../model/md5.js");

//注册页面
exports.regist=function(req,res,next){
    res.render("regist");
}

//登陆页面
exports.login=function(req,res,next){
    res.render("login");
}


//执行注册
exports.doregist=function(req,res,next){
    var uname = req.query.uname;
    var upwd = req.query.upwd;
    //加密
    upwd = md5(md5(upwd).substr(4,7) + md5(upwd));

    //判断是否有相同的用户名
    User.findbookbyName({username : uname}, function(err,result){
    	if (err) {
            req.session.error = '网络异常错误！';
            res.send("-3");
        } else if (result) {
            req.session.error = '用户名已存在！';
            res.send("-2");
        } else {
        	//把用户名和密码存入数据库
		    var doc = {username : uname, password : upwd};
			User.create(doc, function(err,result){
			    if(err){
		            res.send("-1");
		            return;
		        }
			    req.session.error = '用户名创建成功！';
		        res.send("1");
			});
        }
    })
    // 关闭数据库链接
    //db.close();
}

//执行登录
exports.dologin=function(req,res,next){
	var uname=req.body.uname;
	var upwd=req.body.upwd;
	upwd=md5(md5(upwd).substr(4,7) + md5(upwd));
	//检索数据库，按登录名检索数据库，查看密码是否匹配
	User.findbookbyName({username: uname},function(err,result){
		if (err) {
                res.send(500);
                console.log(err);
            } else if (!result) {
                req.session.error = '用户名不存在！';
               // res.send(404);
                res.send("-2");
            } else {
            	//要对用户这次输入的密码，进行相同的加密操作。然后与
	            //数据库中的密码进行比对
               if(upwd != result.password){
               req.session.error = "密码错误!";
                  // res.send(404);
                    res.send("-1");
               }else{
                  req.session.user=result;
                 //  res.send(200);
                 res.send("1"); 
               }
            }
	})
}


//首页
exports.home=function(req,res,next){
    if(req.session.user){
		Commodity.findgoods(function(err,result){
	        res.render('home',{
	        	Commoditys:result
	        });
	    });
    }else{
        req.session.error = "请先登录"
        res.redirect('/login');
    }

  
}

//添加商品页
exports.addcommodity=function(req,res,next){
	res.render('addcommodity');
}

//执行添加商品
exports.doaddcommodity=function(req,res,next){
	Commodity.create({
            name: req.body.name,
            price: req.body.price,
            imgSrc: req.body.imgSrc
        }, function(err,result){
	    if(err){
            res.send("-1");
            return;
        }
        res.send("1");
	});
}

//购物车页
exports.cart=function(req,res,next){
	if(!req.session.user){
        req.session.error = "用户已过期，请重新登录:"
        res.redirect('/login');
    }else{
        Cart.findcartgoods({"uId":req.session.user._id,"cStatus":false}, function (err, result) {
            res.render('cart',{carts:result});
        });
    }
}

//添加购物车
exports.addToCart=function(req,res,next){
	if(!req.session.user){
            req.session.error = "用户已过期，请重新登录:"
            res.redirect('/login');
    }else{
    	Cart.findOnecartgoods({"uId":req.session.user._id, "cId":req.params.id},function(err,result){
    		//商品已存在 +1
                if(result){
                    Cart.updateCartgoods({"uId":req.session.user._id, "cId":req.params.id},{$set : { cQuantity : result.cQuantity + 1 }},function(err,result){
                        //成功返回1  失败返回0
                        if(result > 0){
                            res.redirect('/home');
                        }
                    });
                //商品未存在，添加
                }else{
                	 Commodity.findOnegoods({"_id": req.params.id},function(err,result){
                	 	if (result) {
                	 		Cart.create({
                                uId: req.session.user._id,
                                cId: req.params.id,
                                cName: result.name,
                                cPrice: result.price,
                                cImgSrc: result.imgSrc,
                                cQuantity : 1
                            },function(error,result){
                                if(result){
                                    res.redirect('/home');
                                }
                            });
                	 	}
                	 })
                }
    	})
    	
    }
}

//删除购物车商品
exports.delFromCart=function(req,res,next){
    Cart.removeCartgoods({"_id":req.params.id},function(err,result){
        //成功返回1  失败返回0
        if(err){
           res.send("-1");
		   return;
        }
        res.redirect('/cart');
        res.send(1);
    });
}

//购物车结算
exports.doAccounts=function(req,res,next){
	Cart.updateCartgoods({"_id":req.body.cid},{$set : { cQuantity : req.body.cnum,cStatus:true }},function(err,result){
        //更新成功返回1  失败返回0
        if(result > 0){
            res.send(200);
        }
    });
}
