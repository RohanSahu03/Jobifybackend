const mongoose=require("mongoose")
require("dotenv").config();
const DB=require("./DB")

const connectDB=mongoose.connect(process.env.DB_STR,{
    // useNewUrlParser: true, useUnifiedTopology: true
}).then(()=>{
    console.log("DB Connected..")
}).catch((err)=>{
      console.log(err)  
});

module.exports={connectDB};