const axios = require('axios');
const Employee = require('../models/Employee');

// 🌐 Get coordinates from city using OpenStreetMap
async function getCoordinates(city) {
  try {
   const response = await axios.get('https://nominatim.openstreetmap.org/search', {
  params: {
    q: city,
    format: 'json',
    limit: 1
  },
  headers: {
    'User-Agent': 'YourAppName/1.0' // 👈 zaroori hai!
  }
});


    if (response.data && response.data.length > 0) {
      return {
        latitude: parseFloat(response.data[0].lat),
        longitude: parseFloat(response.data[0].lon)
      };
    } else {
      return { latitude: null, longitude: null };
    }
  } catch (err) {
    console.error("Geocoding error:", err);
    return { latitude: null, longitude: null };
  }
}

// 🧾 List all employees with training recommendation
exports.listEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();

    const updatedEmployees = employees.map(emp => {
      let trainingRecommendation = '✅ No recommendation needed';
      switch (emp.suggestion) {
        case "Maintain engagement":
          trainingRecommendation = '📘 Employee Engagement Workshop';
          break;
        case "Offer growth opportunities":
          trainingRecommendation = '📈 Career Growth Program';
          break;
        case "Skill improvement":
          trainingRecommendation = '💡 Skill Development Training';
          break;
        case "Leadership course":
          trainingRecommendation = '🧠 Leadership Development Training';
          break;
        case "Wellness session":
          trainingRecommendation = '🌿 Employee Wellness Program';
          break;
      }
      return { ...emp.toObject(), trainingRecommendation };
    });

    res.render('employees', { employees: updatedEmployees, showNav: true });
  } catch (err) {
    console.error("❌ Error listing employees:", err.stack || err);
    res.status(500).send("Error loading employees");
  }
};

// 📝 Show form to add employee
exports.createEmployeeForm = (req, res) => {
  res.render('employeeForm');
};

// ➕ Create new employee (FIXED)
exports.createEmployee = async (req, res) => {
  try {
    const coords = await getCoordinates(req.body.location);

    const payload = {
      age: Number(req.body.age),
      salary: Number(req.body.salary),
      workload: Number(req.body.workload),
      tenure: Number(req.body.tenure),
      performance_score: Number(req.body.performance_score)
    };

    console.log("📤 Sending to AI model:", payload);

    const aiResponse = await axios.post('http://127.0.0.1:5000/predict', payload);

    const satisfaction = aiResponse.data.satisfaction;
    const suggestion = aiResponse.data.suggested_action;

    const employee = new Employee({
      name: req.body.name,
      position: req.body.position,
      location: req.body.location,
      age: payload.age,
      salary: payload.salary,
      workload: payload.workload,
      tenure: payload.tenure,
      performance_score: payload.performance_score,
      latitude: coords.latitude,
      longitude: coords.longitude,
      satisfaction,
      suggestion
    });

    await employee.save();
    res.redirect('/employees');
  } catch (err) {
    console.error("❌ Creation error:", err.stack || err);
    res.status(500).send("Error creating employee");
  }
};

// 🔁 Update employee (FIXED)
exports.updateEmployee = async (req, res) => {
  try {
    const coords = await getCoordinates(req.body.location);

    const payload = {
      age: Number(req.body.age),
      salary: Number(req.body.salary),
      workload: Number(req.body.workload),
      tenure: Number(req.body.tenure),
      performance_score: Number(req.body.performance_score)
    };

    console.log("📤 Updating AI model:", payload);

    const aiResponse = await axios.post('http://127.0.0.1:5000/predict', payload);

    const satisfaction = aiResponse.data.satisfaction;
    const suggestion = aiResponse.data.suggested_action;

    await Employee.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      position: req.body.position,
      location: req.body.location,
      age: payload.age,
      salary: payload.salary,
      workload: payload.workload,
      tenure: payload.tenure,
      performance_score: payload.performance_score,
      latitude: coords.latitude,
      longitude: coords.longitude,
      satisfaction,
      suggestion
    });

    res.redirect('/employees');
  } catch (err) {
    console.error("❌ Update error:", err.stack || err);
    res.status(500).send("Error updating employee");
  }
};

// 🗑️ Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.redirect('/employees');
  } catch (err) {
    console.error("❌ Error deleting employee:", err.stack || err);
    res.status(500).send("Server Error");
  }
};

// 🗺️ Show employee map
exports.viewEmployeeMap = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.render('employees-map', { employees });
  } catch (err) {
    console.error("❌ Error loading map:", err.stack || err);
    res.status(500).send("Error loading map");
  }
};

// ✏️ Show edit form
exports.showEditForm = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    res.render('editEmployee', { employee: emp });
  } catch (err) {
    console.error("❌ Error loading edit form:", err.stack || err);
    res.status(500).send("Error showing edit form");
  }
};
