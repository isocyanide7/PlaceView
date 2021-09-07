const express=require('express');

const router =express.Router();

const placeControllers=require('../controllers/places-controllers');

router.get('/:pid',placeControllers.getByPlaceId);

router.get('/users/:uid',placeControllers.getByUserId);

router.post('/',placeControllers.createPlace);

router.patch('/:pid',placeControllers.editPlace);

router.delete('/:pid',placeControllers.deletePlace);

module.exports = router;