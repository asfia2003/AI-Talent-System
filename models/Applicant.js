 const mongoose = require('mongoose');

const ApplicantSchema = new mongoose.Schema({
  name: String,
  email: String,
  experience: Number,
  education: String,
  skills: [String],
  result: String,
  seen: {
    type: Boolean,
    default: false  // 👈 this tracks if HR has seen the applicant
  }
});

module.exports = mongoose.model('Applicant', ApplicantSchema);

