const express =require('express');

const router = express.Router();

const users=[{
    name:"Nilesh",
    uid:'u1'
}];

router.get('/:uid',(req,res,next)=>{
    const userID=req.params.uid;
    const user = users.find(u=>{
        return u.uid===userID;
    });
    res.json({user});
});
module.exports=router;