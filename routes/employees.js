const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController'); // ✅ correct alias

router.get('/employee-form', employeeController.createEmployeeForm);
router.post('/employee-form', employeeController.createEmployee);
router.get('/employees', employeeController.listEmployees);
router.get('/employees-map', employeeController.viewEmployeeMap);

router.get('/employee/edit/:id', employeeController.showEditForm);
router.post('/employee/update/:id', employeeController.updateEmployee);



router.post('/employee/delete/:id', employeeController.deleteEmployee); // ✅ delete route

module.exports = router;
