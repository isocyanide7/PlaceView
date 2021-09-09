const uuid=require('uuid');
const {validationResult}=require('express-validator');
const mongoose = require('mongoose');

const HttpError=require('../models/http-error');
const Place =require('../models/places-schema');
const User=require('../models/users-schema');

//Function to get a place by place ID
const getByPlaceId = async(req,res,next)=>{
    const placeID=req.params.pid;
    let place;
    try{
        place=await Place.findById(placeID);
    }catch(err){
        return next(new HttpError('Something went wrong,please try again'),'404');
    }
    if(!place){
        return  next(new HttpError('Place id not found',404));
    }
    res.json({place:place.toObject({getters:true})});
}

//Function to get a place by User ID
const getByUserId =async(req,res,next)=>{
    const userID=req.params.uid;
    let places;
    try{
        places=await Place.find({creator:userID});
    }catch(err){
        return next(new HttpError('Something went wrong,please try again'),'404');
    }
    if(!places || places.length===0){
        return  next(new HttpError('User id not found',404));
    }
    res.json({places:places.map(p=>p.toObject({getters:true}))});
}

//Function to create new place
const createPlace=async(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError("Input not correct",422));
    }

    const {title,description,address,creator}=req.body;
    const createdPlace=new Place({
        title,
        description,
        location:{
            lat:53.4509161,
            long:-2.4526631
        },
        image:'https://i.pinimg.com/originals/7f/26/e7/7f26e71b2c84e6b16d4f6d3fd8a58bca.png',
        address,
        creator
    });

    let user;
    try{
        user=await User.findById(creator);
     }catch(err){
         return next(new HttpError('Creating place failed,please try again later',500));
     }

    if(!user){
        return next(new HttpError('User not found',404));
    } 

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({session:sess});
        user.places.push(createdPlace);
        await user.save({session:sess});
        await sess.commitTransaction();

    }catch(err){
        return next(new HttpError('Place not created',500));
    }

    res.status(201).json({place:createdPlace});
}

//Function to edit new place
const editPlace=async(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError("Input not correct",422));
    }

    const placeId=req.params.pid;
    const {title,description}=req.body;
    
    let place;
    try{
        place=await Place.findById(placeId);
    }catch(err){
        return next(new HttpError('Something went wrong,please try again 1'),'404');
    }

    place.title=title;
    place.description=description;

    try{
        await place.save();
    }catch(err){
        return next(new HttpError('Something went wrong,please try again'),'404');
    }

    res.status(200).json({place:place.toObject({getters:true})});
};

//Function to delete place
const deletePlace=async(req,res,next)=>{
    const placeId=req.params.pid;

    let place;
    try{
        place=await Place.findById(placeId).populate('creator');
    }catch(err){
        return next(new HttpError('Something went wrong,please try again 1'),'404');
    }
    if(!place){
        return next(new HttpError('Place does not exist',404));
    }

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({session:sess});
        place.creator.places.pull(place);
        await place.creator.save({session:sess});
        await sess.commitTransaction();
    }catch(err){
        return next(new HttpError('Something went wrong,please try again'),'404');
    }

    res.status(200).json({place:place.toObject({getters:true})});
};

exports.getByPlaceId=getByPlaceId;
exports.getByUserId=getByUserId; 
exports.createPlace=createPlace;
exports.editPlace=editPlace;
exports.deletePlace=deletePlace;