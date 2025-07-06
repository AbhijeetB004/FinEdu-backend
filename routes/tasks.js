const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
// const validate = require('../middleware/validation');
// const { taskSchema } = require('../validation/task');

// @route   GET /api/tasks
// @desc    Get user's tasks
router.get('/', auth, taskController.getUserTasks);

// @route   POST /api/tasks
// @desc    Create new task (all authenticated users)
router.post('/', auth, /*validate(taskSchema),*/ taskController.createTask);

// @route   GET /api/tasks/assigned
// @desc    Get tasks assigned by teacher
router.get('/assigned', auth, roleCheck('teacher'), taskController.getAssignedTasks);

// @route   POST /api/tasks/:id/complete
// @desc    Mark task as completed
router.post('/:id/complete', auth, taskController.completeTask);

// @route   PUT /api/tasks/:id
// @desc    Update task (owner only)
router.put('/:id', auth, taskController.updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete task (owner only)
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router; 