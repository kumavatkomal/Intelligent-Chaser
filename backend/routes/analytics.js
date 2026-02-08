import { Router } from "express";
import { getOverviewMetrics, getRiskScores, getResponseAnalytics, getDashboardAnalytics } from "../services/analyticsService.js";

const router = Router();

router.get("/dashboard", async (req, res, next) => {
  try {
    const data = await getDashboardAnalytics();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get("/overview", async (req, res, next) => {
  try {
    const data = await getOverviewMetrics();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get("/risk", async (req, res, next) => {
  try {
    const data = await getRiskScores();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get("/responses", async (req, res, next) => {
  try {
    const data = await getResponseAnalytics();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

export default router;
