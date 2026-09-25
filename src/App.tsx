import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Countries } from "./pages/Countries";
import { Dashboard } from "./pages/Dashboard";
import { TripDetail } from "./pages/TripDetail";

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/countries" element={<Countries />} />
        <Route path="/trips/:tripId" element={<TripDetail />} />
      </Routes>
    </div>
  );
}

export default App;
