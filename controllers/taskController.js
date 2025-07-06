/**
 * Task Controller
 * Handles task CRUD and completion
 */

const Task = require('../models/Task');
const Avatar = require('../models/Avatar');
const { calculateXP, generatePagination } = require('../utils/helpers');
const { ERROR_MESSAGES, SUCCESS_MESSAGES, TASK_TYPES, LESSON_CATEGORIES } = require('../utils/constants');

module.exports = {
  /**
   * @route GET /api/tasks
   * @desc Get user's tasks
   */
  getUserTasks: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const type = req.query.type || '';
      const category = req.query.category || '';
      const status = req.query.status || ''; // 'pending', 'completed', 'overdue'

      let query = { assignedTo: req.user._id, isActive: true };
      
      if (type) query.type = type;
      if (category) query.category = category;
      
      if (status === 'completed') {
        query['completions.student'] = req.user._id;
      } else if (status === 'pending') {
        query['completions.student'] = { $ne: req.user._id };
        query.dueDate = { $gt: new Date() };
      } else if (status === 'overdue') {
        query['completions.student'] = { $ne: req.user._id };
        query.dueDate = { $lt: new Date() };
      }

      const total = await Task.countDocuments(query);
      const tasks = await Task.find(query)
        .populate('assignedBy', 'name email')
        .sort({ dueDate: 1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const pagination = generatePagination(page, limit, total);

      res.status(200).json({
        tasks,
        pagination
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to get tasks', message: err.message });
    }
  },

  /**
   * @route POST /api/tasks
   * @desc Create new task (all authenticated users)
   */
  createTask: async (req, res) => {
    try {
      const {
        title,
        description,
        type,
        category,
        assignedTo,
        dueDate,
        xpReward,
        healthPenalty,
        difficulty,
        priority,
        estimatedDuration,
        instructions,
        tags
      } = req.body;

      // For students, they can only assign tasks to themselves
      // For teachers, they can assign to multiple students
      const taskAssignees = req.user.role === 'teacher' && assignedTo 
        ? assignedTo 
        : [req.user._id];

      const task = await Task.create({
        title,
        description,
        type: type || TASK_TYPES.CUSTOM,
        category: category || LESSON_CATEGORIES.BUDGETING, // Default category
        assignedBy: req.user._id,
        assignedTo: taskAssignees,
        dueDate: new Date(dueDate),
        xpReward: xpReward || 15,
        healthPenalty: healthPenalty || 5,
        difficulty: difficulty || 'medium',
        priority: priority || 'medium',
        estimatedDuration: estimatedDuration || 30,
        instructions,
        tags: tags || []
      });

      const populatedTask = await task.populate('assignedBy', 'name email');
      await populatedTask.populate('assignedTo', 'name email');

      res.status(201).json({
        message: SUCCESS_MESSAGES.TASK_CREATED,
        task: populatedTask
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create task', message: err.message });
    }
  },

  /**
   * @route GET /api/tasks/assigned
   * @desc Get tasks assigned by teacher
   */
  getAssignedTasks: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const status = req.query.status || '';

      let query = { assignedBy: req.user._id };
      
      if (status === 'active') {
        query.isActive = true;
        query.dueDate = { $gt: new Date() };
      } else if (status === 'overdue') {
        query.isActive = true;
        query.dueDate = { $lt: new Date() };
      } else if (status === 'completed') {
        query.isActive = true;
        query['completions.0'] = { $exists: true };
      }

      const total = await Task.countDocuments(query);
      const tasks = await Task.find(query)
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const pagination = generatePagination(page, limit, total);

      res.status(200).json({
        tasks,
        pagination
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to get assigned tasks', message: err.message });
    }
  },

  /**
   * @route POST /api/tasks/:id/complete
   * @desc Toggle task completion status
   */
  completeTask: async (req, res) => {
    try {
      const { completed, score, notes, submittedFiles } = req.body;
      const task = await Task.findById(req.params.id);
      
      if (!task) {
        return res.status(404).json({ error: ERROR_MESSAGES.TASK_NOT_FOUND });
      }

      // Check if user is assigned to this task
      if (!task.assignedTo.includes(req.user._id)) {
        return res.status(403).json({ error: ERROR_MESSAGES.FORBIDDEN });
      }

      const isCurrentlyCompleted = task.isCompletedByStudent(req.user._id);
      const avatar = await Avatar.findOne({ userId: req.user._id });

      if (completed && !isCurrentlyCompleted) {
        // Mark as completed
        await task.markCompleted(req.user._id, score, notes, submittedFiles);
        // Reload the task to get the latest completions
        await task.reload();
        await task.save();

        // Calculate XP and update avatar
        const xpEarned = calculateXP('task', task.difficulty, task.xpReward);
        
        if (avatar) {
          await avatar.addXP(xpEarned);
          avatar.totalTasksCompleted += 1;
          await avatar.save();
        }

        res.status(200).json({
          message: SUCCESS_MESSAGES.TASK_COMPLETED,
          xpEarned,
          score: score || 0,
          avatar: avatar ? avatar.getStats() : null,
          completed: true
        });
      } else if (!completed && isCurrentlyCompleted) {
        // Remove completion
        task.completions = task.completions.filter(
          completion => completion.student.toString() !== req.user._id.toString()
        );
        await task.save();

        // Remove XP and update avatar
        const xpLost = calculateXP('task', task.difficulty, task.xpReward);
        
        if (avatar) {
          await avatar.addXP(-xpLost);
          avatar.totalTasksCompleted = Math.max(0, avatar.totalTasksCompleted - 1);
          await avatar.save();
        }

        res.status(200).json({
          message: 'Task marked as incomplete',
          xpLost,
          avatar: avatar ? avatar.getStats() : null,
          completed: false
        });
      } else {
        // No change needed
        res.status(200).json({
          message: isCurrentlyCompleted ? 'Task already completed' : 'Task already incomplete',
          completed: isCurrentlyCompleted
        });
      }
    } catch (err) {
      res.status(500).json({ error: 'Failed to update task completion', message: err.message });
    }
  },

  /**
   * @route PUT /api/tasks/:id
   * @desc Update task (owner only)
   */
  updateTask: async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ error: ERROR_MESSAGES.TASK_NOT_FOUND });
      }

      // Check if user is the assigner (owner of the task)
      if (task.assignedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: ERROR_MESSAGES.FORBIDDEN });
      }

      const {
        title,
        description,
        type,
        category,
        assignedTo,
        dueDate,
        xpReward,
        healthPenalty,
        difficulty,
        priority,
        estimatedDuration,
        instructions,
        tags,
        isActive
      } = req.body;

      // Update fields
      if (title) task.title = title;
      if (description) task.description = description;
      if (type) task.type = type;
      if (category) task.category = category;
      
      // Only teachers can change assignedTo
      if (assignedTo && req.user.role === 'teacher') {
        task.assignedTo = assignedTo;
      }
      
      if (dueDate) task.dueDate = new Date(dueDate);
      if (xpReward) task.xpReward = xpReward;
      if (healthPenalty) task.healthPenalty = healthPenalty;
      if (difficulty) task.difficulty = difficulty;
      if (priority) task.priority = priority;
      if (estimatedDuration) task.estimatedDuration = estimatedDuration;
      if (instructions) task.instructions = instructions;
      if (tags) task.tags = tags;
      if (isActive !== undefined) task.isActive = isActive;

      await task.save();
      const updatedTask = await task.populate('assignedBy', 'name email');
      await updatedTask.populate('assignedTo', 'name email');

      res.status(200).json({
        message: 'Task updated successfully',
        task: updatedTask
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update task', message: err.message });
    }
  },

  /**
   * @route DELETE /api/tasks/:id
   * @desc Delete task (owner only)
   */
  deleteTask: async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ error: ERROR_MESSAGES.TASK_NOT_FOUND });
      }

      // Check if user is the assigner (owner of the task)
      if (task.assignedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: ERROR_MESSAGES.FORBIDDEN });
      }

      // Soft delete
      task.isActive = false;
      await task.save();

      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete task', message: err.message });
    }
  }
}; 