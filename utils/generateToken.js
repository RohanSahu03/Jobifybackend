const asynHandler =require("express-async-handler");
const jwt=require("jsonwebtoken");

exports.genToken=asynHandler(async(data)=>{
    
    return jwt.sign({data},process.env.JWT_SECRET,{
        expiresIn:24*60*60
    })
})

