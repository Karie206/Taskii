import express from "express";
import {
    getAllTasks,
    createTask,
    updateTask,
    reorderTasks,
    deleteTask
} from "../controllers/tasksControllers.js";

const router = express.Router();

router.get("/", getAllTasks);

router.post("/", createTask);

// Must be declared before "/:id" so "reorder" isn't parsed as an id
router.put("/reorder", reorderTasks);

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);

export default router;