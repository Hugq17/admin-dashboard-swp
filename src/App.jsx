import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage";
import Login from "./pages/Login/Login";
import { useState, useEffect } from "react";
import User from "./pages/User/User";
import Blog from "./pages/Blog/Blog";
import Sidebar from "./components/common/Sidebar";
import Interest from "./pages/Interest/Interest";
import Workshop from "./pages/Workshop/Workshop";
import AdminInfo from "./pages/Admin/AdminInfo";

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
    <div className="flex h-screen bg-gradient-to-b from-pink-400 to-blue-400 text-gray-100">
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
        <Route
          path="/nguoidung"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <User />
            </PrivateRoute>
          }
        />
        <Route
          path="/baiviet"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Blog />
            </PrivateRoute>
          }
        />
        <Route
          path="/taikhoan"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <User />
            </PrivateRoute>
          }
        />
        <Route
          path="/sothich"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Interest />
            </PrivateRoute>
          }
        />
        <Route
          path="/workshop"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Workshop />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <AdminInfo />
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={
            <Navigate to={isLoggedIn ? "/trangchu" : "/login"} replace />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
