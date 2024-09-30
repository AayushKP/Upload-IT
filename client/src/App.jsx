import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import FileUpload from "./components/FileUpload";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check for token in local storage on initial render
    return !!localStorage.getItem("token");
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the JWT token on logout
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/upload"
          element={
            isLoggedIn ? <FileUpload /> : <Login onLogin={handleLogin} />
          }
        />
        <Route path="/" element={<Login onLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
};

export default App;
