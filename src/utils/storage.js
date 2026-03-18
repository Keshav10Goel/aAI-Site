
export const saveSession = (data) => {

  const existing = JSON.parse(localStorage.getItem("eyeSessions")) || [];

  existing.push({
    ...data,
    date: new Date().toISOString()
  });

  localStorage.setItem(
    "eyeSessions",
    JSON.stringify(existing)
  );
};

export const getSessions = () => {
  return JSON.parse(localStorage.getItem("eyeSessions")) || [];
};

export const saveMetric = (data) => {

  const existing =
    JSON.parse(localStorage.getItem("eyeMetrics")) || [];

  existing.push({
    ...data,
    timestamp: new Date().toISOString()
  });

  localStorage.setItem(
    "eyeMetrics",
    JSON.stringify(existing)
  );

};

export const getMetrics = () => {
  return JSON.parse(localStorage.getItem("eyeMetrics")) || [];
};