const Applicant = require('../models/Applicant');
const Employee = require('../models/Employee');

exports.renderDashboard = async (req, res) => {
  try {
    const applicants = await Applicant.find();
    const employees = await Employee.find();

    const suitableCount = applicants.filter(a => a.result === 'Suitable').length;
    const notSuitableCount = applicants.length - suitableCount;

    const satisfiedCount = employees.filter(e => e.satisfaction === 'Satisfied').length;
    const atRiskCount = employees.length - satisfiedCount;

    res.render('dashboard', {
      layout: 'layout',
      showNav: true,
      applicantData: [suitableCount, notSuitableCount],
      employeeData: [satisfiedCount, atRiskCount],
      user: req.user // 👈 for welcome message
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).send('Internal Server Error');
  }
};
