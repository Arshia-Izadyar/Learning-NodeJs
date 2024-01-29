const express = require('express'); 
const controller = require("../controller/home");
const asyncWrapper = require("../middleware/async");

const router = express.Router();


router.route('/').get(controller.allItems);
router.route('/').post(asyncWrapper(controller.createTask));
router.route('/:id').get(controller.getTask);
router.route('/:id').put(controller.updateTask);
router.route('/:id').delete(controller.deleteTask);

module.exports = router;
