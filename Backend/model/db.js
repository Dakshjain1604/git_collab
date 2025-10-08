const mongoose=require("mongoose");
const { string } = require("zod");
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URL)



const userSchema=new mongoose.Schema({
    firstname:String,
    lastname:String,
    username:{type:String,unique:true},
    password:{type:String}
})


const user=mongoose.model("User",userSchema);
module.exports={
    user
}