
const express = require('express');
const tourController = require('./../controllers/tourController')
const authController = require('./../controllers/authController')   
const reviewController = require('./../controllers/reviewController')
const reviewRouter = require('./../routes/reviewRoutes')    

const {getTour,postTour, updateTour, getTours, deleteTour} = tourController;

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter)
// geospatial routes

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin)


// calculating distances
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances)

// top 5 cheapest

router.route('/top-5-cheap').get(tourController.aliasTopTours, getTours)
router.route('/tour-stats').get(tourController.getTourStats)
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan)

// router.param('id', tourController.checkId)




router.route('/:id').get(getTour).patch(authController.protect, updateTour).delete(authController.protect, authController.restrictTo('admin', 'lead-guide'),  deleteTour);
router.route('/').post(authController.protect, postTour).get(getTours);




// router.route('/:tourId/reviews').post(authController.protect, authController.restrictTo('user'), reviewController.createReview)
module.exports = router;
