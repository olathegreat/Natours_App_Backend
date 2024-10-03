const fs = require('fs');
const Tour = require('../models/tourModel')
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');


const { start } = require('repl');
exports.aliasTopTours = (req, res, next) =>{
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage, price";
  req.query.fields = "name, price, ratingsAverage, summary, difficulty";


  next()
}





exports.getTours = factory.getAll(Tour);  
// exports.getTours = catchAsync(async (req, res) => {
  
//     // Build Query
//     //   //  1a Filtering
//     // const queryObj = {...req.query};
//     // const excludedFields =  ['page', 'sort', 'limit', 'fields']

//     // excludedFields.forEach((el)=> delete queryObj[el])

//     // // 1b Advanced filtering

//     // let queryStr = JSON.stringify(queryObj);
//     // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=>`$${match}`);



//     // let query =  Tour.find(JSON.parse(queryStr))

//     // 2 sorting
//     // if(req.query.sort){
//     //   query = query.sort(req.query.sort)
//     // } for sorting with just one field but for multiple fields go to the next line

//     // if(req.query.sort){
//     //   const sortBy = req.query.split(',').join(' ')
//     //   query= query.sort(sortBy)
//     // }else{
//     //   query = query.sort('-createdAt')
//     // }

//     // 3 limiting fields
//     // to return only the fields 
//     // if(req.query.fields){
//     //    const fields = req.query.fields.split(",").join(" ");
//     //    query = query.select(fields)
//     // }else{
//     //   // to return all fields minus _v
//     //    query = query.select('-_v')
//     // }


//     //  4 pagination
//     //  const page = req.query.page *1 || 1;
//     //  const limit = req.query.limit *1 || 100;
//     //  const skip = (page - 1) * limit


//     //  query = query.skip(skip).limit(limit);

//     //   //  to return error for pages that are not there

//     //   if(req.query.page) {
//     //     const numTours = await Tour.countDocuments();
//     //     if(skip>=numTours) throw new Error('This page doesnot exist')
//     //   }
//     // Execute query
//     const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
//     // const tours = await query;
//       const tours = await features.query;

//     res.status(200).json({
//       status: "sucess",
//       results: tours.length,
//       data:{
//         tours
//       }
//     })


 
// });

exports.postTour = factory.createOne(Tour); 
// catchAsync(async (req, res, next) => {

 
//  const newTour = await Tour.create(req.body);

//  res.status(201).json({
//   status: 'success',
//   data:{
//     tour: newTour
//   }
//  })
 
// });

exports.getTour = factory.getOne(Tour, {path: 'reviews'});
// catchAsync(async (req, res) => {
//   // eslint-disable-next-line no-shadow
//   // const tour = tours.find((tour) => tour.id === parseInt(req.params.id, 10));

  
//     const tour = await Tour.findById(req.params.id).populate('reviews')
//     // .populate({
//     //   path:'guides',
//     //   select:'-_v -paswwordChangedAt'
//     // });             

//     if(!tour){
//       return next(new AppError('No tour found with that ID', 404))
//     }

//     res.status(200).json({
//       status: "sucess",
//       results: tour.length,
//       data:{
//         tour
//       }
//     })

 

 
// });

exports.updateTour = factory.updateOne(Tour);
// catchAsync( async (req, res) => {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,{
//       new: true,
//       runValidators: true,  
//     });
//     if(!tour){
//       return next(new AppError('No tour found with that ID', 404))
//     }

//     res.status(200).json({
//       status: "sucess",
//       results: tour.length,
//       data:{
//         tour
//       }
//     })


// });

exports.deleteTour = factory.deleteOne(Tour);
// catchAsync( async(req, res) => {
   
//     const tour = await Tour.findByIdAndDelete(req.params.id);
//     if(!tour){
//       return next(new AppError('No tour found with that ID', 404))
//     }

//     res.status(200).json({
//       status: "sucess",
//       results: tour.length,
//       data:null
//     })


// });

// Aggregation pipeline: matching and grouping

exports.getTourStats = catchAsync(async (req, res) => { 
  

    const stats = await Tour.aggregate([
      // match: to filter documents based on the given conditions
      {
        $match:{ratingsAverage: {$gte: 4.5}}  
      },
      {
        // group: to group documents based on the given conditions  
        $group:{
          _id:{$toUpper: "$difficulty"},
          numRating:{$sum:"$ratingsQuantity"}  ,
          numTours:{$sum:1},  
          avgRating:{$avg:"$ratingsAverage"},
          avgPrice:{$avg:"$price"},
          minPrice:{$min:"$price"},
          maxPrice:{$max:"$price"},
          
        }
      },{
        $sort: {avgPrice:1}
      }
    ])

    res.status(200).json({
      status:"success",
      data:{
        stats
      }
    })

 
 })

//  get monthly plans and arrange on how busy they are with number of tours
exports.getMonthlyPlan = catchAsync( async (req, res) => { 
  
    const year = req.params.year
    const plan = await Tour.aggregate([
      // unwind: to unwind the array of tours in each document basically to deconstruct it
      {
        $unwind: "$startDates"
      },
      {
        $match: {
          startDates:{
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id:{$month:"$startDates"},
          numTourStarts: {$sum:1},
          tours:{$push:"$name"}
        }
      },
      {
        $addFields: {month:"_id"}
      },
      {$project:{_id:0}},
      {$sort:{numTourStarts:-1}}

    ])
    res.status(200).json({
      status:"success",
      data:{
        plan
      }
    })


 })
 exports.getToursWithin = catchAsync( async (req, res) => {

    const {distance, latlng, unit} = req.params;
    const [lat, lng] = latlng.split(',')

    if(!lat || !lng){
      return next(new AppError('Please provide latitude and longitude in the format lat, lng', 400))
    } 
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1; 
    const tours = await Tour.find({
      startLocation:{
        $geoWithin:{
          $centerSphere:[[lng, lat], radius]
        }
      }
    })
    res.status(200).json({
      status:"success",
      results: tours.length,
      data:{
        tours
      }
    })

 })


 exports.getDistances = catchAsync( async (req, res) => {
  const {latlng, unit} = req.params;
    const [lat, lng] = latlng.split(',')

    if(!lat || !lng){
      return next(new AppError('Please provide latitude and longitude in the format lat, lng', 400))
    }
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
    const distances = await Tour.aggregate([
      {
        $geoNear:{
          near:{
            type: 'Point',
            coordinates: [lng * 1, lat * 1]
          },
          distanceField: 'distance',
          distanceMultiplier: multiplier,
        }
      },{
          $project:{
            distance:1,
            name:1
          }
        }
      ])
 })