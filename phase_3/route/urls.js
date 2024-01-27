const express = require('express'); 
const controller = require("../controller/home");

const router = express.Router();


router.route('/').get(controller.allItems);
router.route('/').post(controller.createTask);
router.route('/:id').get(controller.getTask);
router.route('/:id').put(controller.updateTask);
router.route('/:id').delete(controller.deleteTask);

module.exports = router;