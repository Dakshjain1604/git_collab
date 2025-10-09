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

const experienceSchema = new mongoose.Schema({
    title : {type : String, required: true},
    company : {type: String, required: true},
    startdate : {type : Date, required: true},
    enddate: {type : Date},
    technologies_used : [{type: String}]
})

const educationSchema = new mongoose.Schema({
    institution : {type: String},
    year : {type : Date},
    degree : {type : String}
})

const resumeSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title : {type :String},
    summary: {type: String},
    education: [educationSchema],
    experience : [experienceSchema],
    projects : {type : String}
})


const user=mongoose.model("User",userSchema);
module.exports={
    user
}
const resume = mongoose.model("Resume",resumeSchema);
module.exports={
    resume
}
const experience = mongoose.model("Experience",experienceSchema);
module.exports={
    experience
}

const education = mongoose.model("Education",educationSchema);
module.exports={
    education
}