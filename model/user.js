let mongoose = require('mongoose')
let Schema = mongoose.Schema

let userdata = new Schema({
    
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
      
})

let USER = mongoose.model('Signup-Login',userdata)

module.exports = USER
