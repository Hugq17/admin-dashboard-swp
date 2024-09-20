import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ updateStatus }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleInputChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleInputChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = (event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form
    if (email === "Nghi" && password === "1") {
      updateStatus();
      navigate("/dashboard");
    }
  };

  return (
    <div className="login-image">
      <div className="flex items-center p-40 w-full">
        <form
          onSubmit={handleLogin}
          className="flex flex-col items-center w-full"
        >
          <p className="text-6xl pixelify-sans text-white w-screen flex justify-center">
            For you
          </p>
          <div className="mt-10 w-full flex justify-center">
            <input
              value={email}
              placeholder="Username"
              onChange={handleInputChangeEmail}
              className="bg-[#F1F1F1] p-3 rounded-md"
            />
          </div>
          <div className="mt-1 mb-8 w-full flex justify-center">
            <input
              placeholder="Password"
              value={password}
              type="password"
              onChange={handleInputChangePassword}
              className="bg-[#F1F1F1] p-3 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-max"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
