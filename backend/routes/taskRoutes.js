const express = require('express');

const {
    getTasks,
    createTask,
    deleteTask,
    completeTask
} = require('../controllers/taskController');

const router = express.Router();

router.get('/', getTasks);

router.post('/', createTask);

router.delete('/:id', deleteTask);

router.put('/:id', completeTask);

module.exports = router;