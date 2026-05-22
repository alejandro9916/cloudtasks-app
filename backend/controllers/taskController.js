const Task = require('../models/Task');



// GET TASKS

exports.getTasks = async (req, res) => {

    try {

        const tasks = await Task.find({

            user: req.user.id

        });



        res.json(tasks);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};



// CREATE TASK

exports.createTask = async (req, res) => {

    try {

        const task = new Task({

            title: req.body.title,

            category: req.body.category,

            priority: req.body.priority,

            dueDate: req.body.dueDate,

            user: req.user.id

        });



        const savedTask = await task.save();

        res.status(201).json(savedTask);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};



// UPDATE TASK

exports.updateTask = async (req, res) => {

    try {

        const task = await Task.findOne({

            _id: req.params.id,

            user: req.user.id

        });



        if (!task) {

            return res.status(404).json({

                message: 'Tarea no encontrada'

            });

        }



        task.completed = !task.completed;



        await task.save();



        res.json(task);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};



// DELETE TASK

exports.deleteTask = async (req, res) => {

    try {

        const task = await Task.findOneAndDelete({

            _id: req.params.id,

            user: req.user.id

        });



        if (!task) {

            return res.status(404).json({

                message: 'Tarea no encontrada'

            });

        }



        res.json({

            message: 'Tarea eliminada'

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};