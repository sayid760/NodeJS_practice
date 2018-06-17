var express = require("express");
var app = express();
var formidable = require('formidable');
var db = require("./model/db.js");
var router = require("./router/router.js");
var bodyParser = require('body-parser'); //使用req.body
var session = require('express-session');

var md5 = require("./model/md5.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("./public"));

// 设定view engine变量，意为网页模板引擎
//app.set('view engine', 'ejs');
app.set( 'view engine', 'html' );
app.engine( '.html', require( 'ejs' ).__express );

app.use(session({
    secret:'secret',
    cookie:{
        maxAge:1000*60*30
    }
}));

// 动态全局变量
app.use(function(req, res, next){
    res.locals.user = req.session.user;
    var err = req.session.error;
    res.locals.message = '';
    if (err) res.locals.message = '<div class="alert alert-danger" style="margin-bottom: 20px;color:red;">' + err + '</div>';
    next();
});

app.get("/regist",router.regist);
app.get("/login",router.login);
app.get("/doregist",router.doregist);
app.post("/dologin",router.dologin);
app.get("/home",router.home);
app.get('/addcommodity',router.addcommodity);
app.post('/doaddcommodity',router.doaddcommodity);
app.get('/cart',router.cart);
app.get("/addToCart/:id",router.addToCart);
app.get("/delFromCart/:id",router.delFromCart);
app.post("/cart/doAccounts",router.doAccounts);

app.listen("3000",function(){
	console.log('Express server listening on port 3000');
})


