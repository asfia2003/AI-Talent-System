 const mongoose = require('mongoose');

const FilterSchema = new mongoose.Schema({
  minExperience: Number,
  requiredSkills: [String],
  preferredEducation: String
});

module.exports = mongoose.model('FilterSettings', FilterSchema);

