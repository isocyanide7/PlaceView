const uuid=require('uuid')

const HttpError=require('../models/http-error');

const users=[{
    id: uuid.v4(),
    name:"Nilesh",
    email: "Myemail@email.com",
    password: "testing"
}];

const allUsers=(req,res,next)=>{
    res.status(200).json({users});
};

const signup=(req,res,next)=>{
    const {name,email,password}=req.body;
    const existing=users.find(u=>u.email===email);
    if(existing){
        return next(new HttpError("Already Existing user"),"222");
    }
    const newUser={
        id:uuid.v4(),
        name,
        email,
        password
    };
    users.push(newUser);
    res.status(201).json({"message":"signup successful"});
};

const login=(req,res,next)=>{
    const {email,password}=req.body;
    const user=users.find(u=>u.email===email);
    if(!user){
        return next(new HttpError("User Not registered","222"));
    }
    if(user.password!=password){
        return next(new HttpError("Password not correct","222"));
    }
    res.status(200).json({"message":"Login successful!!"});
};

exports.allUsers=allUsers;
exports.signup=signup;
exports.login=login;