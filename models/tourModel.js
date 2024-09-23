const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a maximum group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty level'],
  },
  ratingsAverge: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'Summary is required'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'Image cover is required']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
},{
  toJSON: { virtuals: true }, 
  toObject:{virtual:true}
});

const Tour = mongoose.model('Tour', tourSchema);

// Virtual property- for fields that need to be calculated but  not saved to the database e.g conversion betweeen days
tourSchema.virtual('durationWeeks').get(function(){
  return this.duration / 7;
})

module.exports = Tour;
