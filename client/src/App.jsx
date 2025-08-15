import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/homepage";
import FirstTimeSetup from "./pages/onboarding/FirstTimeSetup";
import JobLists from "./pages/JobLists";
import CalendarPage from "./pages/calendarPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/onboarding" element={<FirstTimeSetup />} />
        <Route path="/jobs" element={<JobLists />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
