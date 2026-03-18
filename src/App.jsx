
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Progress from "./pages/Progress";


function App() {
  useEffect(() => {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}, []);
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Landing />} />

        <Route path="/monitor" element={<Dashboard />} />

        <Route path="/progress" element={<Progress />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
