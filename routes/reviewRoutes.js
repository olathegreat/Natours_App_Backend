const express = require('express');
const reviewController = require('./../controllers/reviewController')
const authController = require('./../controllers/authController') 



const router = express.Router({mergeParams:true});

router.use(authController.protect)



router.route('/')
       .post( authController.restrictTo('user'),reviewController.setTourUserIds ,reviewController.createReview)
       .get(reviewController.getAllReviews)

router.route('/:id').patch(reviewController.updateReview)
router.route('/:id').get(reviewController.getReview)    
router.route('/:id').delete(reviewController.deleteReview)


module.exports = router;

