const mongoose = require("mongoose");

const socialSchema = new mongoose.Schema(
  {
    linkedin: String,
    github: String,
    portfolio: String,
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    headline: { type: String, default: "" },
    currentRole: { type: String, default: "" },
    location: { type: String, default: "" },
    summary: { type: String, default: "" },
    skills: { type: [String], default: [] },
    socialLinks: { type: socialSchema, default: () => ({}) },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    profile: { type: profileSchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

