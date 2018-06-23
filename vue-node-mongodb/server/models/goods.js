var mongoose = require('mongoose')
var Schema = mongoose.Schema

var productSchema = new Schema({
  'productId': String,
  'productName': String,
  'salePrice': Number,
  'productImage': String,
  'checked': Number,
	'productNum': Number	
})

module.exports = mongoose.model('Good', productSchema)