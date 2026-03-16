
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

