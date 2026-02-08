import { Router } from "express";
import { sendEmail, sendSlack } from "../services/channelService.js";

const router = Router();

router.post("/email", async (req, res, next) => {
  try {
    const result = await sendEmail(req.body);
    res.json({ status: "ok", result });
  } catch (error) {
    next(error);
  }
});

router.post("/slack", async (req, res, next) => {
  try {
    const result = await sendSlack(req.body);
    res.json({ status: "ok", result });
  } catch (error) {
    next(error);
  }
});

export default router;
