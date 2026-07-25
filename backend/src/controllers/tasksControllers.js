import mongoose from "mongoose";
import Task from "../models/Task.js";

// CRUD
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ order: 'asc', createdAt: 'desc' });

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

        // New tasks go to the top of the list
        const firstTask = await Task.findOne().sort({ order: 'asc' }).select('order').lean();
        const order = firstTask ? firstTask.order - 1 : 0;

        const task = new Task({ title, order });

        const newTask = await task.save();

        res.status(201).json({ data: newTask, success: true });

    } catch (err) {
        console.error("Error creating task: ", err.message);
        res.status(500).json({ message: "Error creating task", success: false });
    }
};

export const updateTask = async (req, res) => {
    try {
        // Without this, a non-id path (e.g. "/reorder") turns into a CastError => bare 500
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: `Invalid task id: "${req.params.id}"`,
                success: false
            });
        }

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

export const reorderTasks = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "ids must be a non-empty array", success: false });
        }

        // Drop duplicates so two positions can't fight over the same task
        const uniqueIds = [...new Set(ids.map(String))];

        const invalidIds = uniqueIds.filter((id) => !mongoose.isValidObjectId(id));
        if (invalidIds.length > 0) {
            return res.status(400).json({
                message: `Invalid task id(s): ${invalidIds.join(", ")}`,
                success: false
            });
        }

        // ordered: false => an id that no longer exists doesn't abort the rest
        const result = await Task.bulkWrite(
            uniqueIds.map((id, index) => ({
                updateOne: {
                    filter: { _id: id },
                    update: { $set: { order: index } },
                },
            })),
            { ordered: false }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "No matching tasks to reorder", success: false });
        }

        const tasks = await Task.find().sort({ order: 'asc', createdAt: 'desc' });

        res.status(200).json({ data: tasks, success: true });
    } catch (err) {
        console.error("Error reordering tasks: ", err.message);
        res.status(500).json({ message: `Error reordering tasks: ${err.message}`, success: false });
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