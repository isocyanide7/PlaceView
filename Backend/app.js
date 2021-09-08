const express =require('express');
const bodyParser= require('body-parser');
const mongoose=require('mongoose');

const HttpError = require('./models/http-error');

const placesRoutes=require('./routes/places-routes');
const userRoutes=require('./routes/users-routes');

const app=express();

app.use(bodyParser.json());

app.use('/api/places',placesRoutes);
app.use('/api/users',userRoutes);

app.use((req,res,next)=>{
    return next(new HttpError("Route not found",404));
})

app.use((error, req, res, next)=>{
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message:error.message || 'An unknown error occured'});
});


mongoose.connect('mongodb+srv://romi:nilesh123@cluster0.wgj1s.mongodb.net/places?retryWrites=true&w=majority')
.then(()=>{
    app.listen(5000);
})
.catch(err=>{
    console.log(err);
});
