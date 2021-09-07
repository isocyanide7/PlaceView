const uuid=require('uuid');
const {validationResult}=require('express-validator');

const HttpError=require('../models/http-error');

let places=[{
    id:"p1",
    title: "KGP Railway Station",
    description:"Railway station in Kharagpur",
    location:{
        lat:22.3408398,
        long:87.3237453
    },
    address:"Kharagpur, West Bengal 721301",
    creator:"u1"
}]; 

//Function to get a place by place ID
const getByPlaceId = (req,res,next)=>{
    const placeID=req.params.pid;
    const place=places.find(p=>{
        return p.id===placeID;
    })
    if(!place){
        return  next(new HttpError('Place id not found',404));
    }
    res.json({place});
}

//Function to get a place by User ID
const getByUserId =(req,res,next)=>{
    const userID=req.params.uid;
    const newplaces=places.filter(p=>{
        return p.creator===userID;
    });
    if(!newplaces || newplaces.length===0){
        return  next(new HttpError('User id not found',404));
    }
    res.json({places});
}

//Function to create new place
const createPlace=(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError("Input not correct",422));
    }

    const {title,description,address,creator}=req.body;
    const createdPlace={
        id:uuid.v4(),
        title,
        description,
        location:{
            lat:53.4509161,
            long:-2.4526631
        },
        address,
        creator
    };
    places.push(createdPlace);

    res.status(201).json({place:createdPlace});
}

//Function to edit new place
const editPlace=(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError("Input not correct",422));
    }

    const placeId=req.params.pid;
    const {title,description}=req.body;
    const updatedPlace=places.find(p=>p.id===placeId);
    const placeIndex=places.findIndex(p=>p.id===placeId);
    updatedPlace.title=title;
    updatedPlace.description=description;
    places[placeIndex]=updatedPlace;

    res.status(200).json({place:updatedPlace});
};

//Function to delete place
const deletePlace=(req,res,next)=>{
    const placeId=req.params.pid;
    const deletedplace=places.filter(p=>p.id!==placeId);
    places=deletedplace;

    res.status(200).json({message:"deleted"});
};

exports.getByPlaceId=getByPlaceId;
exports.getByUserId=getByUserId; 
exports.createPlace=createPlace;
exports.editPlace=editPlace;
exports.deletePlace=deletePlace;