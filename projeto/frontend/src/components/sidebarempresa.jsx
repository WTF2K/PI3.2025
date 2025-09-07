// SideBarEmpresa.jsx
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./style.css";
import Logo from "../imgs/logo1.png";

export default function SideBarEmpresa({ visible, onClose }) {
  const [userName, setUserName] = useState("");
  const [idempresa, setEmpresaId] = useState("");
  const [iduser, setUserId] = useState("");
  const location = useLocation();

  // Só mostra a sidebar se a rota começar por "/empresa"
  if (!location.pathname.startsWith("/empresa")) return null;

  useEffect(() => {
    setUserName(localStorage.getItem("nome") || "");
    setEmpresaId(localStorage.getItem("idempresa") || "");
    setUserId(localStorage.getItem("iduser") || "");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className={`sidebar scroll ${visible ? "visible" : "hidden"} position-fixed w-25`}>
      <button className="btn btn-danger d-md-none close-drawer" onClick={onClose}>X</button>
      <nav className="vh-100 navbar-sidebar d-flex flex-column" style={{ backgroundColor: "#385471" }}>
        <NavLink to="/empresa/inicio" className="navlink-container d-flex align-items-center justify-content-center">
          <img src={Logo} alt="Logo" className="logocafdashboard w-50" />
        </NavLink>
        <hr className="m-0" />
        <ul className="nav nav-pills flex-column mb-auto">
          <li><NavLink to="/empresa/inicio" className="nav-link text-white">Início</NavLink></li>
          <li><NavLink to="/empresa/dashboard" className="nav-link text-white">Dashboard</NavLink></li>
          <li><NavLink to={"/empresa/${idempresa}"} className="nav-link text-white">Perfil Empresa</NavLink></li>
          <li><NavLink to={"/empresa/${idempresa}/editar"} className="nav-link text-white">Editar Perfil</NavLink></li>
          <li><NavLink to="/empresa/propostas" className="nav-link text-white">Minhas Propostas</NavLink></li>
          <li><NavLink to="/empresa/propostas/add" className="nav-link text-white">Nova Proposta</NavLink></li>
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
