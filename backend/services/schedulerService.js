import cron from "node-cron";
import { Task } from "../models/Task.js";
import { triggerChase } from "./chaserService.js";

const getHoursUntilDeadline = (dueDate) => {
  const now = new Date();
  return Math.ceil((new Date(dueDate) - now) / (1000 * 60 * 60));
};

const shouldTriggerForWindow = (hoursLeft) => {
  return [48, 24, 4, 1].includes(hoursLeft);
};

export const startScheduler = () => {
  console.log("⏱️  Chaser Scheduler started - running every 15 minutes");
  
  cron.schedule("*/15 * * * *", async () => {
    try {
      console.log(`⏰ [${new Date().toLocaleTimeString()}] Checking for tasks to chase...`);
      
      const tasks = await Task.find({ status: { $ne: "completed" } }).populate("assignee");
      console.log(`📊 Found ${tasks.length} active tasks to check`);

      let chasedCount = 0;
      
      for (const task of tasks) {
        const hoursLeft = getHoursUntilDeadline(task.dueDate);
        
        if (hoursLeft < 0) {
          console.log(`⏸️  Skipped: Task "${task.title}" is already overdue`);
          continue;
        }

        if (shouldTriggerForWindow(hoursLeft)) {
          if (!task.assignee) {
            console.log(`⚠️  Skipped: Task "${task.title}" has no assignee`);
            continue;
          }
          
          console.log(`🚀 CHASING: "${task.title}" - ${hoursLeft}h until deadline for ${task.assignee.name}`);
          await triggerChase({ task, assignee: task.assignee });
          chasedCount++;
        }
      }
      
      if (chasedCount > 0) {
        console.log(`✅ Chased ${chasedCount} task${chasedCount > 1 ? 's' : ''}`);
      } else {
        console.log(`ℹ️  No tasks to chase this cycle`);
      }
    } catch (error) {
      console.error("❌ Scheduler error:", error.message);
    }
  });
};

