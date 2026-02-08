import { useEffect, useState } from "react";
import api from "../services/api.js";

export const useAnalytics = () => {
  const [overview, setOverview] = useState(null);
  const [risk, setRisk] = useState([]);
  const [responses, setResponses] = useState(null);

  const loadAnalytics = async () => {
    const [overviewRes, riskRes, responseRes] = await Promise.all([
      api.get("/analytics/overview"),
      api.get("/analytics/risk"),
      api.get("/analytics/responses")
    ]);

    setOverview(overviewRes.data);
    setRisk(riskRes.data);
    setResponses(responseRes.data);
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  return { overview, risk, responses, refresh: loadAnalytics };
};
