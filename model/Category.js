const mongoose = require('mongoose');
let Schema = mongoose.Schema

const category = new Schema({
    type: { type: String, required: true, error : 'Enter Diffrent type of categorys' },
    newcategory: {type: String, require: true},
    imageurl: {type: String, require: true},
    summary: {type: String, require: true},

});

let catagory =  mongoose.model('Category',category);

module.exports = catagory
