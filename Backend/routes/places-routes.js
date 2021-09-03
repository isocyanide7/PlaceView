const express=require('express');

const router =express.Router();

const placeControllers=require('../controllers/places-controllers');

router.get('/:pid',placeControllers.getByPlacebId);

router.get('/users/:uid',placeControllers.getByUserId);

router.post('/',placeControllers.createPlace);

module.exports = router;