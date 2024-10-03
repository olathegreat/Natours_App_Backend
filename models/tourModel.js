const mongoose = require('mongoose');
const User = require('./userModel')

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
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: val => Math.round(val * 10) / 10
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
  startLocation:{
    // GEOJSON embedding location
    type:{
      type: String,
      default: 'Point',
      enum:['Point']
    },
    coordinates:[Number], 
    address: String,
    description: String
   
  },
  locations:[
    {
      type:{
        type:String,
        default:'Point',
        enum:['Point']
      },
      coordinates:[Number], 
    address: String,
    description: String,
    day:Number

    }
  ],
  guides:[
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    }
  ]
},{
  toJSON: { virtuals: true }, 
  toObject:{virtual:true}
});

tourSchema.index({startLocation:'2dsphere'})

tourSchema.index({price:1, ratingsAverge:-1})
tourSchema.index({slug:1})  



tourSchema.pre('save', async function(next){
  // const guidesPromises = this.guides
  //                             .map(async(id)=>await User.findById(id))

  // this.guides = await Promise.all(guidesPromises)

  next();
                            })

tourSchema.pre(/^find/, function(next){
  this.populate({
    path:'guide',
    select:'-_v -paswwordChangedAt'
  })
  next()
})

tourSchema.virtual('reviews',{
  ref:'Review',
  foreignField:"tour",
  localField:'_id'
})


const Tour = mongoose.model('Tour', tourSchema);

// Virtual property- for fields that need to be calculated but  not saved to the database e.g conversion betweeen days
tourSchema.virtual('durationWeeks').get(function(){
  return this.duration / 7;
})

module.exports = Tour;
