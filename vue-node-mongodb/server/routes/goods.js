var express = require('express')
var mongoose = require('mongoose')
var Goods = require('../models/goods.js');
var User=require('../models/user');

var router = express.Router()

mongoose.connect('mongodb://localhost:27017/test')
//mongoose.connect('mongodb://127.0.0.1:27017/test')

mongoose.connection.on('connected', function() {
  console.log('connected')
})

mongoose.connection.on('error', function() {
  console.log('error')
})

mongoose.connection.on('disconnected', function() {
  console.log('disconnected')
})

//查询商品数据
router.get('/list', function(req, res, next) {
	let page=parseInt(req.param("page"));
	let pageSize=parseInt(req.param("pageSize"));
	let priceLevel=req.param("priceLevel"); //传的是0 ，1 ...并不知道他代表什么
	let sort=req.param("sort");
	let skip=(page-1)*pageSize;
	let priceGt='',priceLte='';
	let params={};
	if(priceLevel != "all"){ //等于all的时候全条件查询
		switch(priceLevel){
			case '0' :priceGt=0;priceLte=100; break;
			case '1' :priceGt=100;priceLte="500"; break;
			case '2' :priceGt=500;priceLte="1000"; break;
			case '3' :priceGt=1000;priceLte="5000"; break;
		}
		params = { //条件查询
			'salePrice':{
				$gt:priceGt,
				$lte:priceLte
			}
		}
	}
  
	let goodModel=Goods.find(params).skip(skip).limit(pageSize); //分页 //默认跳过skip条数据  limit一页n条
	goodModel.sort({'salePrice':sort}) //排序
	goodModel.exec(function(err, doc) {
	    if (err) {
	      res.json({
	        status: '1',
	        msg: err.message
	      })
	    } else {
	      res.json({
	        status: '0',
	        msg: '',
	        result: {
	          count: doc.length,
	          list: doc
	        }
	      })
	    }
	})
})

//加入到购物车
///goods/addCart app.js已经定义一级路由，所以里面不用加/goods/
router.post("/addCart",function(req, res, next){
    var userId = '1077',
        productId = req.body.productId;  // post请求拿到res参数：req.body

    // 查询第一条:拿到用户信息
    User.findOne({
        userId:userId   // 查询条件
    },function(err,userDoc){
        if(err){
            res.json({
                status:"1",
                msg:err.message
            })
        }else{
        	//找到用户后，需要往用户商品里面插商品数据
		    	//如果购物车里面已经有某件商品了，我们只需要把商品里面的数量++
            if(userDoc){
            	//查看用户的购物车有没有添加某个商品
                let goodsItem = '';
                userDoc.cartList.forEach(function(item){    // 遍历用户购物车，判断加入购物车的商品是否已经存在
                	  //如果遍历里面的id等于传过来的id,说明我们cartList已经存在了
						        //说明用户的购物车已经有这条数据，有数据的话要把这条商品信息存起来
                    if(item.productId == productId){
                        goodsItem = item;
                        item.productNum++; // 购物车这件商品数量+1
                    }
                })
                if(goodsItem){  // 若购物车商品已存在
                    userDoc.save(function (err2,doc2) {
                        if(err2){
                            res.json({
                                status:"1",
                                msg:err2.message
                            })
                        }else{
                            res.json({
                                status:'0',
                                msg:'',
                                result:'suc'
                            })
                        }
                    })
                }else{
                	// 若购物车商品不存在，就添加进去
                    Goods.findOne({productId:productId},function(err1,doc){  // 从商品列表页Goods查询点击加入购物车的那件商品信息
                         console.log(doc)
                         console.log(doc.prodcutImg)
                        if(err1){
                            res.json({
                                status:"1",
                                msg:err1.message
                            })
                        }else{
														if(doc){//如果找到商品，就加数量就行
                                doc.productNum = 1;   // 在Goods模型中添加属性，要去models/goods.js的Schema添加这两个属性。
							                	doc.checked = 1;
                                userDoc.cartList.push(doc); // 添加信息到用户购物车列表中
                                
                                /* 
                                 * //也可以这样添加属性
																	var newobj = null;
																	newobj = { //新创建一个对象，实现转换mongoose不能直接增加属性的坑
																		  productId: doc.productId,
																		  producName: doc.producName,
																		  salePrice: doc.salePrice,
																		  productImage: doc.productImage,
																		  checked: 1,
																		  productNum: 1	
																	}
																userDoc.cartList.push({doc});  //往查出来的信息里面push数据，这里不能用User.push
                                 */                               
                                userDoc.save(function(err2,doc2){  // 保存数据库 
                                    if(err2){
                                        res.json({
                                            status:"1",
                                            msg:err2
                                        })
                                    }else{
                                        res.json({
                                            status:"0",
                                            msg:'',
                                            result:'suc'
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            }
        }
    })
})


module.exports = router