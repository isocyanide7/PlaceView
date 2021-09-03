const uuid=require('uuid');

const HttpError=require('../models/http-error');

const places=[{
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
const getByPlacebId = (req,res,next)=>{
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
    const place=places.find(p=>{
        return p.creator===userID;
    });
    if(!place){
        return  next(new HttpError('User id not found',404));
    }
    res.json({place});
}

//Function to create new place
const createPlace=(req,res,next)=>{
    const {title,description,location,address,creator}=req.body;
    const createdPlace={
        id:uuid.v4(),
        title,
        description,
        location,
        address,
        creator
    };
    places.push(createdPlace);

    res.status(201).json({place:createdPlace});
}

exports.getByPlacebId=getByPlacebId;
exports.getByUserId=getByUserId; 
exports.createPlace=createPlace;