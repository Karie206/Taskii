import Task from "../models/Task.js";

// CRUD
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: 'desc' });

        if (!tasks) {
            return res.status(404).json({ message: "No tasks found", success: false });
        }

        res.status(200).json({ data: tasks, success: true });
    }
    catch (err) {
        console.error("Error fetching tasks: ", err.message);
        res.status(500).json({ message: "Error fetching tasks", success: false });
    }

};

export const createTask = async (req, res) => {
    try {
        const { title } = req.body;
        const task = new Task({ title });

        const newTask = await task.save();

        res.status(201).json({ data: newTask, success: true });

    } catch (err) {
        console.error("Error creating task: ", err.message);
        res.status(500).json({ message: "Error creating task", success: false });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { title, status, completedAt } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title,
                status,
                completedAt
            },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found", success: false });
        }

        res.status(200).json({ data: updatedTask, success: true });
    } catch (err) {
        console.error("Error updating task: ", err.message);
        res.status(500).json({ message: "Error updating task", success: false });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found", success: false });
        }

        res.status(200).json({ message: "Delete task successfully", success: true });
    } catch (err) {
        console.error("Error deleting task: ", err.message);
        res.status(500).json({ message: "Error deleting task", success: false });
    }
};