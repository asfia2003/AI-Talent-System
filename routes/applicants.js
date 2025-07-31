const express = require('express');
const router = express.Router();
const controller = require('../controllers/applicantController');
const applicantController = require('../controllers/applicantController');


router.get('/apply', controller.applyForm);
router.post('/apply', controller.submitApplication);
router.get('/applicants', controller.listApplicants);

router.get('/applicants/edit/:id', controller.editApplicantForm);
router.post('/applicants/delete/:id', controller.deleteApplicant);



router.post('/applicants/edit/:id', controller.updateApplicant);

router.get('/notifications', applicantController.showNotifications);
router.get('/notifications/count', applicantController.getUnseenApplicantCount);




module.exports = router;


module.exports = router;
 
