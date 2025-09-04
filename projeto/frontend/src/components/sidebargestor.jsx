// SideBarGestor.jsx
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./style.css";
import Logo from "../imgs/logo1.png";

export default function SideBarGestor({ visible, onClose }) {
  const [userName, setUserName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const nome = localStorage.getItem("nome");
    if (nome) setUserName(nome);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className={`sidebar scroll ${visible ? "visible" : "hidden"} position-fixed w-25`}>
      <button className="btn btn-danger d-md-none close-drawer" onClick={onClose}>X</button>
      <nav className="vh-100 navbar-sidebar d-flex flex-column" style={{ backgroundColor: "#385471" }}>
        <NavLink to="/gestor/dashboard" className="navlink-container d-flex align-items-center justify-content-center">
          <img src={Logo} alt="Logo" className="logocafdashboard w-50" />
        </NavLink>
        <hr className="m-0" />
        <ul className="nav nav-pills flex-column mb-auto">
          
          <li><NavLink to="/gestor/dashboard2" className="nav-link text-white">Estatísticas</NavLink></li>
          <li><NavLink to="/gestor/inicio" className="nav-link text-white">Propostas recentes</NavLink></li>
          <li><NavLink to="/gestor/propostas/add" className="nav-link text-white">Adicionar Proposta</NavLink></li>
          <li><NavLink to="/gestor/propostas/validate" className="nav-link text-white">Validar Propostas</NavLink></li>
          <li><NavLink to="/gestor/propostas" className="nav-link text-white">Propostas</NavLink></li>
          <li><NavLink to="/gestor/estudantes" className="nav-link text-white">Gerir Estudantes</NavLink></li>
        </ul>
        <hr className="m-0" />
        <div className="user-info d-flex align-items-center justify-content-between text-white px-3">
          <p className="mb-0">{userName}</p>
          <button className="bg-transparent border-0 text-white" onClick={handleLogout}>Logout</button>
        </div>
      </nav>
    </div>
  );
}
