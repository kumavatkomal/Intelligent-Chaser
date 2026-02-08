import { Router } from "express";
import { Task } from "../models/Task.js";
import { triggerChase } from "../services/chaserService.js";

const router = Router();

router.post("/manual/:taskId", async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId).populate("assignee");
    
    if (!task) {
      console.warn(`Task not found: ${req.params.taskId}`);
      return res.status(404).json({ message: "Task not found" });
    }
    
    if (!task.assignee) {
      console.warn(`Task ${task._id} has no assignee`);
      return res.status(404).json({ message: "Task has no assignee - please add assignee email when creating task" });
    }

    console.log(`Triggering chase for task: ${task.title} to ${task.assignee.email}`);
    
    const result = await triggerChase({
      task,
      assignee: task.assignee,
      channelOverride: req.body?.channel
    });

    res.json({ status: "sent", result });
  } catch (error) {
    console.error("Chase error:", error);
    next(error);
  }
});

export default router;
