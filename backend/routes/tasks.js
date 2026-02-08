import { Router } from "express";
import { body, validationResult } from "express-validator";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const tasks = await Task.find({}).populate("assignee").sort({ dueDate: 1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  [
    body("title").notEmpty().withMessage("title is required"),
    body("dueDate").notEmpty().withMessage("dueDate is required"),
    body("status").optional().isIn(["pending", "in_progress", "completed", "overdue"])
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { assigneeEmail, ...payload } = req.body;
      if (assigneeEmail) {
        const normalizedEmail = assigneeEmail.trim().toLowerCase();
        let user = await User.findOne({ email: normalizedEmail });
        if (!user) {
          const name = normalizedEmail.split("@")[0] || "User";
          user = await User.create({ name, email: normalizedEmail });
        }
        payload.assignee = user._id;
      }

      const task = await Task.create(payload);
      
      
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }
);

router.patch("/:id", async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.post("/bulk-delete", async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "ids must be a non-empty array" });
    }

    const result = await Task.deleteMany({ _id: { $in: ids } });
    res.json({ deletedCount: result.deletedCount });
  } catch (error) {
    next(error);
  }
});

export default router;
