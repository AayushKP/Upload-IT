import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-400 to-pink-600 text-white">
      <h1 className="text-2xl font-bold">UP LOADER</h1>
      <div>
        {isLoggedIn ? (
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="text-white mx-2">
              Login
            </Link>
            <Link to="/register" className="text-white mx-2">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
