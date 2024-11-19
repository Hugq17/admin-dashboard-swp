import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icon từ react-icons

const Login = ({ updateStatus }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleInputChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://sharingcafe-be.onrender.com/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      // Giả sử accessToken nằm trong data.accessToken, hãy lưu nó vào localStorage
      if (data && data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        updateStatus();
        navigate("/dashboard");
      } else {
        console.error("No access token received");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Đăng nhập
        </h1>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Username
            </label>
            <input
              value={email}
              placeholder="Enter your username"
              onChange={handleInputChangeEmail}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="relative">
            <label className="block text-gray-600 font-medium mb-2">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                placeholder="Enter your password"
                value={password}
                type={showPassword ? "text" : "password"}
                onChange={handleInputChangePassword}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-0 mr-3 flex items-center justify-center text-gray-600 hover:text-gray-800 h-full focus:outline-none"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
