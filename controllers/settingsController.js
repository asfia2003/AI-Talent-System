const FilterSettings = require('../models/FilterSettings');

exports.getSettings = async (req, res) => {
  const settings = await FilterSettings.findOne();
  res.render('settings', { settings });
};

exports.saveSettings = async (req, res) => {
  const { minExperience, preferredEducation, requiredSkills } = req.body;
  const skillArray = Array.isArray(requiredSkills) ? requiredSkills : [requiredSkills];

  await FilterSettings.deleteMany({}); // Remove previous
  await FilterSettings.create({
    minExperience,
    preferredEducation,
    requiredSkills: skillArray
  });

  res.redirect('/settings');
};
 
