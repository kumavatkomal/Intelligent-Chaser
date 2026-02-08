export const selectChannelForTime = ({ now, priority, preferredChannel }) => {
  const hour = now.getHours();

  if (priority === "urgent") {
    return "multi";
  }

  if (hour >= 9 && hour <= 11) {
    return "slack";
  }

  if (hour >= 13 && hour <= 17) {
    return "email";
  }

  return preferredChannel || "email";
};
