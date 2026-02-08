import "dotenv/config";
import mongoose from "mongoose";
import { User } from "./models/User.js";
import { Task } from "./models/Task.js";
import { ChaseLog } from "./models/ChaseLog.js";

const MONGODB_URI = process.env.MONGODB_URI;

const seedData = async () => {
  await mongoose.connect(MONGODB_URI);

  // Clear existing data
  await User.deleteMany({});
  await Task.deleteMany({});
  await ChaseLog.deleteMany({});

  // Create users (assignees)
  const users = await User.create([
    {
      name: "Rahul Sharma",
      email: "rahul@example.com",
      preferredChannel: "email",
      avgResponseTime: 12,
      responseRate: 0.85,
      responsePattern: "responds within 12h usually"
    },
    {
      name: "Priya Patel",
      email: "priya@example.com",
      preferredChannel: "slack",
      slackId: "@priya",
      avgResponseTime: 6,
      responseRate: 0.95,
      responsePattern: "very responsive, prefers Slack"
    },
    {
      name: "Amit Kumar",
      email: "amit@example.com",
      preferredChannel: "email",
      avgResponseTime: 24,
      responseRate: 0.6,
      responsePattern: "slow responder, needs follow-ups"
    },
    {
      name: "Sneha Gupta",
      email: "sneha@example.com",
      preferredChannel: "slack",
      slackId: "@sneha",
      avgResponseTime: 8,
      responseRate: 0.9,
      responsePattern: "reliable, responds in mornings"
    },
    {
      name: "Vikram Singh",
      email: "vikram@example.com",
      preferredChannel: "email",
      avgResponseTime: 18,
      responseRate: 0.7,
      responsePattern: "evening responder"
    }
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create tasks with different statuses and deadlines
  const now = new Date();
  const tasks = await Task.create([
    {
      title: "Complete Hackathon PPT",
      description: "Create final presentation deck with demo screenshots",
      assignee: users[0]._id,
      dueDate: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours
      priority: "urgent",
      status: "in_progress",
      chaseCount: 2
    },
    {
      title: "Deploy Backend to Render",
      description: "Set up production backend deployment",
      assignee: users[1]._id,
      dueDate: new Date(now.getTime() + 12 * 60 * 60 * 1000), // 12 hours
      priority: "high",
      status: "pending",
      chaseCount: 1
    },
    {
      title: "Write API Documentation",
      description: "Document all REST endpoints with examples",
      assignee: users[2]._id,
      dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 1 day
      priority: "medium",
      status: "pending",
      chaseCount: 0
    },
    {
      title: "Test Email Integration",
      description: "Verify all email triggers work correctly",
      assignee: users[3]._id,
      dueDate: new Date(now.getTime() + 6 * 60 * 60 * 1000), // 6 hours
      priority: "high",
      status: "in_progress",
      chaseCount: 1
    },
    {
      title: "Setup MongoDB Indexes",
      description: "Optimize database queries with proper indexes",
      assignee: users[4]._id,
      dueDate: new Date(now.getTime() + 48 * 60 * 60 * 1000), // 2 days
      priority: "low",
      status: "pending",
      chaseCount: 0
    },
    {
      title: "Boltic Workflow Testing",
      description: "Test all Boltic integrations end-to-end",
      assignee: users[0]._id,
      dueDate: new Date(now.getTime() + 8 * 60 * 60 * 1000), // 8 hours
      priority: "high",
      status: "pending",
      chaseCount: 0
    },
    {
      title: "Frontend Dark Mode",
      description: "Implement dark mode toggle functionality",
      assignee: users[1]._id,
      dueDate: new Date(now.getTime() + 36 * 60 * 60 * 1000), // 1.5 days
      priority: "medium",
      status: "pending",
      chaseCount: 0
    },
    {
      title: "Security Audit",
      description: "Review code for security vulnerabilities",
      assignee: users[2]._id,
      dueDate: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago (overdue)
      priority: "urgent",
      status: "overdue",
      chaseCount: 3
    },
    {
      title: "Analytics Dashboard Polish",
      description: "Fix chart responsiveness and add tooltips",
      assignee: users[3]._id,
      dueDate: new Date(now.getTime() + 18 * 60 * 60 * 1000), // 18 hours
      priority: "medium",
      status: "completed",
      chaseCount: 0
    },
    {
      title: "Demo Video Recording",
      description: "Record 3-minute product demo video",
      assignee: users[4]._id,
      dueDate: new Date(now.getTime() + 4 * 60 * 60 * 1000), // 4 hours
      priority: "urgent",
      status: "in_progress",
      chaseCount: 1
    }
  ]);

  console.log(`✅ Created ${tasks.length} tasks`);

  // Create some chase logs
  const chaseLogs = await ChaseLog.create([
    {
      task: tasks[0]._id,
      assignee: users[0]._id,
      channel: "email",
      message: "Hi Rahul, just a friendly reminder about the hackathon PPT. It's due in 2 hours!",
      status: "sent",
      sentAt: new Date(now.getTime() - 1 * 60 * 60 * 1000)
    },
    {
      task: tasks[1]._id,
      assignee: users[1]._id,
      channel: "slack",
      message: "Hey Priya, the backend deployment is coming up. Let me know if you need any help!",
      status: "sent",
      sentAt: new Date(now.getTime() - 30 * 60 * 1000)
    },
    {
      task: tasks[7]._id,
      assignee: users[2]._id,
      channel: "email",
      message: "URGENT: The security audit is overdue. Please prioritize this immediately.",
      status: "sent",
      sentAt: new Date(now.getTime() - 3 * 60 * 60 * 1000)
    }
  ]);

  console.log(`✅ Created ${chaseLogs.length} chase logs`);

  console.log("\n🎉 Database seeded successfully!");
  console.log("📊 Summary:");
  console.log(`   - ${users.length} users`);
  console.log(`   - ${tasks.length} tasks`);
  console.log(`   - ${chaseLogs.length} chase logs`);

  await mongoose.disconnect();
};

seedData().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
