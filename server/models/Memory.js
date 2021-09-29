const mongoose = require('mongoose');

const memorySchema = mongoose.Schema({
  user_id: { type: String, required: true },
  context: {
    restaurant_name: { type: String, required: true },
    restaurant_address: String,
    user_tags: [{ user_id: String }],
    date: { type: Date, required: true },
  },
  country_name: { type: String, required: true },
  rating: Number, // out of 5
  // TODO add images with labels 
})

memorySchema.pre([/save/i, /update/i], function (next) { // TODO why doesnt it run for findByIdAndUpdate? 
  if (typeof this.rating === 'string') this.rating = parseFloat(this.rating);
  // rating must be between 0 and 5, inclusively.
  this.rating = Math.min(this.rating, 5);
  this.rating = Math.max(this.rating, 0);
  // rating must be in 0.5 step size
  this.rating = round(this.rating, 0.5);
  next();
});

function round(value, step) {
  step || (step = 1.0);
  const inv = 1.0 / step;
  return Math.round(value * inv) / inv;
}

module.exports = mongoose.model('Memory', memorySchema);
