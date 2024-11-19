import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage";
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
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("accessToken"))
  );

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(Boolean(token));
  }, []);

  const updateStatus = () => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(Boolean(token));
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {isLoggedIn && <Sidebar logout={logout} />}
      <Routes>
        <Route path="/login" element={<Login updateStatus={updateStatus} />} />
        <Route
          path="/trangchu"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Homepage />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
