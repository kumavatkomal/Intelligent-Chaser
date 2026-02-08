export const formatDate = (dateValue) => {
  if (!dateValue) return "";
  return new Date(dateValue).toLocaleDateString();
};

export const daysUntil = (dateValue) => {
  const now = new Date();
  const date = new Date(dateValue);
  return Math.max(Math.ceil((date - now) / (1000 * 60 * 60 * 24)), 0);
};
