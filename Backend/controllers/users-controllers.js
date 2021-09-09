const uuid=require('uuid')
const {validationResult, body}=require('express-validator');

const HttpError=require('../models/http-error');
const User=require('../models/users-schema');

const users=[{
    id: uuid.v4(),
    name:"Nilesh",
    email: "Myemail@email.com",
    password: "testing"
}];

const allUsers=async(req,res,next)=>{
    let users;
    try{
        users= await User.find({},'-password'
        );
    }catch(err){
        return next(new HttpError('Something went wrong,please try again later'),401);
    }

    res.status(200).json({users:users.map(u=>u.toObject({getters:true}))});
};

const signup=async(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next(new HttpError(errors.array()[0].msg,422));
    }

    const {name,email,password}=req.body;

    let existing;
    try{
        existing=await User.findOne({email:email});
    }catch(err){
        return next(new HttpError('Signup failed1, please try again later',500));
    }

    if(existing){
        return next(new HttpError('Email already registered'),422);
    }

    const createdUser=new User({
        name,
        email,
        password,
        image:'https://www.gannett-cdn.com/presto/2020/03/17/USAT/c0eff9ec-e0e4-42db-b308-f748933229ee-XXX_ThinkstockPhotos-200460053-001.jpg?crop=1170%2C658%2Cx292%2Cy120&width=1200',
        places:[]
    });
    try{
        await createdUser.save();
    }catch(err){
        console.log(err);
        return next(new HttpError('Signup2 failed, please try again later',500));
    }

    res.status(201).json({user:createdUser.toObject({getters:true})});
};

const login=async(req,res,next)=>{
    const {email,password}=req.body;
    let existing;
    try{
        existing=await User.findOne({email:email});
    }catch(err){
        return next(new HttpError('Login failed, please try again later',500));
    }

    if(!existing || existing.password!==password){
        return next(new HttpError('Invalid credentials'),422);
    }
    res.status(200).json({"message":"Login successful!!"});
};

exports.allUsers=allUsers;
exports.signup=signup;
exports.login=login;