const Applicant = require('../models/Applicant');
const FilterSettings = require('../models/FilterSettings');

exports.applyForm = (req, res) => {
  res.render('apply');
};

exports.submitApplication = async (req, res) => {
  const { name, email, experience, education, skills } = req.body;
  const skillsArray = Array.isArray(skills) ? skills : [skills];

  const filters = await FilterSettings.findOne() || {};

  let isSuitable = true;

  if (filters.minExperience && experience < filters.minExperience) isSuitable = false;
  if (filters.preferredEducation && education !== filters.preferredEducation) isSuitable = false;
  if (filters.requiredSkills) {
    const matchedSkills = skillsArray.filter(skill => filters.requiredSkills.includes(skill));
    if (matchedSkills.length < filters.requiredSkills.length) isSuitable = false;
  }

  const applicant = new Applicant({
    name,
    email,
    experience,
    education,
    skills: skillsArray,
    result: isSuitable ? "Suitable" : "Not Suitable"
  });

  await applicant.save();

  res.send(`
    <h3>Thank you for applying!</h3>
    <p><strong>Result:</strong> ${applicant.result}</p>
     
  `);
};





// --- NEW: Edit‑form page ---
exports.editApplicantForm = async (req, res) => {
  const applicant = await Applicant.findById(req.params.id);
  if (!applicant) return res.status(404).send('Applicant not found');
  res.render('applicant-edit', { applicant, showNav: false }); // create this EJS later
};



exports.updateApplicant = async (req, res) => {
  const { name, email, experience, education, skills } = req.body;
  const skillArray = Array.isArray(skills) ? skills : [skills];

  await Applicant.findByIdAndUpdate(req.params.id, {
    name,
    email,
    experience,
    education,
    skills: skillArray
  });

  res.redirect('/applicants');
};


// --- NEW: Delete applicant ---
exports.deleteApplicant = async (req, res) => {
  await Applicant.findByIdAndDelete(req.params.id);
  res.redirect('/applicants');
};
exports.listApplicants = async (req, res) => {
  const applicants = await Applicant.find();
  res.render('applicants', {
    applicants,
    showNav: false // 🚫 This hides the navbar
  });
};


exports.getUnseenApplicantCount = async (req, res) => {
  try {
    const count = await Applicant.countDocuments({ seen: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching unseen count' });
  }
};


// ✅ applicantController.js
exports.showNotifications = async (req, res) => {
  const unseenApplicants = await Applicant.find({ seen: false });

  res.render('notifications', { 
    applicants: unseenApplicants, 
    showNav: true 
  });

  await Applicant.updateMany({ seen: false }, { $set: { seen: true } });
};

