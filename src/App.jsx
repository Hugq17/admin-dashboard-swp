import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import Sidebar from "./components/Sidebar";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login/Login";
import { useState, useEffect } from "react";

function PrivateRoute({ isLoggedIn, children }) {
  const location = useLocation();
  return isLoggedIn ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  // Boolean(localStorage.getItem("authToken"))

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(Boolean(token));
  }, []);

  const updateStatus = () => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(Boolean(token));
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
  };

  return (
    <div className="">
      {/* {isLoggedIn && <Sidebar logout={logout} />} */}
      <Routes>
        <Route path="/login" element={<Login updateStatus={updateStatus} />} />
        <Route path="/dashboard" element={<OverviewPage />} />
      </Routes>
    </div>
  );
}

export default App;
