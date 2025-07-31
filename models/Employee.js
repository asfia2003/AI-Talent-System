const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: String,
  position: String,
  city: String, // 🟢 Renamed from 'location' to 'city'
  age: Number,
  salary: Number,
  workload: Number,
  tenure: Number,
  performance_score: Number,
  latitude: Number,
  longitude: Number,
  satisfaction: String, 
  suggestion: String
});

module.exports = mongoose.model('Employee', employeeSchema);
