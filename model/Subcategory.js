const mongoose = require('mongoose');
let Schema = mongoose.Schema

const subcategorySchema = new Schema({
  name: {type: String, require: true},
  subcategoryName: { type: String, required: true },
  imageurl: { type: String, required: true },
  details: { type: String, required: true },
  moreInfo: { type: String, require: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
});

let subcategory = mongoose.model('Subcategory',subcategorySchema)

module.exports = subcategory
