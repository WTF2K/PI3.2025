import React from "react";
import "../App.css";

const Navbar = ({ title, onToggleSidebar }) => {
  return (
    <nav
      className="navbar-admin w-100"
      style={{ backgroundColor: "#385471", borderBottom: "5px solid #5A84B0" }}
    >
      <div className="d-flex align-items-center">
        <button
          className="btn btn-dark d-md-none me-2"
          onClick={onToggleSidebar}
        >
          ☰
        </button>
            <h1 className="ms-3 text-white">{title}</h1>
      </div>
    </nav>
  );
};

export default Navbar;
