import React from "react";
import { NavLink } from "react-router-dom";

import "./nav.scss";

function Nav({ user, setuser }) {
  const logout = () => {
    localStorage.clear("token");
    localStorage.clear("googletoken");
    setuser(null);
  };
  return (
    <div className="nav">
      <div className="logo">
        <h4>
          Auth <span>App</span>
        </h4>
      </div>
      <div className="link">
        {user ? (
          <>
            {" "}
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Home
            </NavLink>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Sign Up
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
}

export default Nav;
