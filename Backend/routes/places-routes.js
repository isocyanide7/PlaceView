const express=require('express');
const {check} =require('express-validator');

const router =express.Router();

const placeControllers=require('../controllers/places-controllers');

router.get('/:pid',placeControllers.getByPlaceId);

router.get('/users/:uid',placeControllers.getByUserId);

router.post('/',
            [
                check('title').notEmpty(),
                check('description').isLength({min:10})
            ],    
            placeControllers.createPlace);

router.patch('/:pid',
            [
                check('title').notEmpty(),
                check('description').isLength({min:10})
            ],
            placeControllers.editPlace);

router.delete('/:pid',placeControllers.deletePlace);

module.exports = router;