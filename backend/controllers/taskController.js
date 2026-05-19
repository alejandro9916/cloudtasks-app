const Task = require('../models/Task');

const getTasks = async (req, res) => {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
};

const createTask = async (req, res) => {
    const { title } = req.body;

    const task = await Task.create({
        title
    });

    res.json(task);
};

const deleteTask = async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);

    res.json({
        message: 'Tarea eliminada'
    });
};

const completeTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if(task){
        task.completed = !task.completed;

        const updatedTask = await task.save();

        res.json(updatedTask);
    }
};

module.exports = {
    getTasks,
    createTask,
    deleteTask,
    completeTask
};