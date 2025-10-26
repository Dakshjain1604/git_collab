const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL);


const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  username: { type: String, unique: true },
  password: { type: String }
});

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  startdate: { type: Date, required: true },
  enddate: { type: Date },
  technologies_used: [{ type: String }]
});

const educationSchema = new mongoose.Schema({
  institution: { type: String },
  year: { type: Date },
  degree: { type: String }
});

const resumeSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String },
  summary: { type: String },
  education: [educationSchema],
  experience: [experienceSchema],
  projects: { type: String }
});


const User = mongoose.models.User || mongoose.model('User', userSchema);
const Experience = mongoose.models.Experience || mongoose.model('Experience', experienceSchema);
const Education = mongoose.models.Education || mongoose.model('Education', educationSchema);
const Resume = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);


module.exports = { User, Experience, Education, Resume };
