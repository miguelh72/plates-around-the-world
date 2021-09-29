const mongoose = require('mongoose');

const userModel = mongoose.Schema({
  name: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: String,
  email: String,
  facebook_id: String,
  picture_fb: String,
  last_login_IP: { type: String, required: true },
  last_login_time: { type: Date, required: true },
})

module.exports = mongoose.model('User', userModel);
