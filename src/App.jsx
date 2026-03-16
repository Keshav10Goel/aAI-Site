
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Progress from "./pages/Progress";

function App() {
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
