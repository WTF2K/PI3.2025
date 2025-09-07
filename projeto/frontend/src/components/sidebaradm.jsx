import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./style.css";

import Logo from "../imgs/logo1.png";

export default function SideBar({ visible, onClose }) {
  const [userName, setUserName] = useState("");
  const [tipoUtilizador, setTipoUtilizador] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    propostas: false,
    estudantes: false,
    options: false,
  });
  const [selected, setSelected] = useState(""); // Estado para armazenar o item selecionado

  useEffect(() => {
    const nome = localStorage.getItem("nome");
     // Pega o nome do utilizador do localStorage
    if (nome) {
      setUserName(nome);
    }
  }, []);

  const toggleDropdown = (key) => setIsDropdownOpen((prevState) => ({
    ...prevState,
    [key]: !prevState[key],
  }));

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("nome");
    localStorage.removeItem("tipoUtilizador");
    localStorage.removeItem("id");
    window.location.href = "/";
  };

  return (
    <div
      className={`sidebar scroll ${
        visible ? "visible" : "hidden"
      } position-fixed w-25`}
    >
      <button
        className="btn btn-danger d-md-none close-drawer"
        onClick={onClose}
      >
        X
      </button>
      <nav
        className="vh-100 navbar-sidebar d-flex flex-column"
        style={{ backgroundColor: "#385471" }}
      >
        <NavLink
          className="navlink-container d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none justify-content-center"
          to="/adm/dashboard"
          onClick={() => setSelected("/adm/dashboard")} // Define o link selecionado
        >
          <img src={Logo} alt="Logo da CAF" className="logocafdashboard w-50" />
        </NavLink>
        <hr className="m-0" />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                `nav-link text-white ${isActive ? "sidebar-act" : ""}`
              }
              to="/adm/dashboard"
              onClick={() => setSelected("/adm/dashboard")}
            >
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                `nav-link text-white ${isActive ? "sidebar-act" : ""}`
              }
              to="/adm/inicio"
              onClick={() => setSelected("/adm/inicio")}
            >
              Propostas Recentes
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                `nav-link text-white ${isActive ? "sidebar-act" : ""}`
              }
              to="/adm/notifications"
              onClick={() => setSelected("/adm/notifications")}
            >
              Notificações
            </NavLink>
          </li>
          <li className="nav-item">
            <div
              className={`nav-link text-white d-flex justify-content-between align-items-center ${
                selected.startsWith("/adm/propostas") ? "sidebar-act" : ""
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => {
                toggleDropdown("propostas")
              }}
            >
              Propostas
              <span>{isDropdownOpen.propostas ? "▲" : "▼"}</span>
            </div>
            {isDropdownOpen.propostas && (
              <ul className="nav flex-column">
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link text-white ${isActive ? "sidebar-act" : ""}`
                    }
                    to="/adm/propostas"
                    end
                    onClick={() => setSelected("/adm/propostas")}
                  >
                    Ver Propostas
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link text-white ${isActive ? "sidebar-act" : ""}`
                    }
                    to="/adm/propostas/add"
                    end
                    onClick={() => setSelected("/adm/propostas/add")}
                  >
                    Adicionar Proposta
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link text-white ${isActive ? "sidebar-act" : ""}`
                    }
                    to="/adm/propostas/validate"
                    end
                    onClick={() => setSelected("/adm/propostas/validate")}
                  >
                    Validar Propostas
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          <hr className="m-0" />
          <li className="nav-item">
            <div
              className={`nav-link text-white d-flex justify-content-between align-items-center ${
                selected.startsWith("/adm/estudantes") ? "sidebar-act" : ""
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setIsDropdownOpen((prevState) => ({
                  ...prevState,
                  estudantes: !prevState.estudantes,
                }));
              }}
            >
              Estudantes
              <span>{isDropdownOpen.estudantes ? "▲" : "▼"}</span>
            </div>
            {isDropdownOpen.estudantes && (
              <ul className="nav flex-column">
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link text-white ${isActive ? "sidebar-act" : ""}`
                    }
                    to="/adm/estudantes"
                    end
                    onClick={() => setSelected("/adm/estudantes")}
                  >
                    Ver Estudantes
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link text-white ${isActive ? "sidebar-act" : ""}`
                    }
                    to="/adm/estudantes/create"
                    end
                    onClick={() => setSelected("/adm/estudantes/create")}
                  >
                    Criar Conta
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link text-white ${isActive ? "sidebar-act" : ""}`
                    }
                    to="/adm/estudantes/inativos"
                    end
                    onClick={() => setSelected("/adm/estudantes/inativos")}
                  >
                    Ex-Estudantes
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link text-white ${isActive ? "sidebar-act" : ""}`
                    }
                    to="/adm/estudantes/validate"
                    end
                    onClick={() => setSelected("/adm/estudantes/validate")}
                  >
                    Validar Remoções
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
          {/*<li className="nav-item">
            <NavLink
              className={`nav-link text-white ${
                selected === "/adm/equipas" ? "sidebar-act" : ""
              }`} // Aplica a classe sidebar-act
              to="/adm/equipas"
              onClick={() => setSelected("/adm/estudantes/remove")}
            >
              Remoção de Estudantes
            </NavLink>
          </li>*/}
          <li className="nav-item">
            <NavLink
                    className={({ isActive }) =>
                      `nav-link text-white ${isActive ? "sidebar-act" : ""}`
                    }
              to="/adm/gestores"
              end
              onClick={() => setSelected("/adm/gestores")}
            >
              Gerir Perfis de Gestores
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className={`nav-link text-white ${
                selected === "/adm/equipas" ? "sidebar-act" : ""
              }`} // Aplica a classe sidebar-act
              to="/adm/equipas"
              onClick={() => setSelected("/adm/inscricoes")}
            >
              Inscrições
            </NavLink>
          </li>
          <hr className="m-0" />
          <li className="nav-item">
            <NavLink
              className={`nav-link text-white ${
                selected === "/adm/utiizadores" ? "sidebar-act" : ""
              }`} // Aplica a classe sidebar-act
              to="/adm/utilizadores"
              onClick={() => setSelected("/adm/utilizadores")}
            >
              Utilizadores
            </NavLink>
          </li>
        </ul>
        <hr className="m-0" />
        <div className="user-info d-flex align-items-center justify-content-between">
          <p className="text-white mb-0">{userName}</p>
          <div className="btn-group dropup">
            <button
              type="button"
              className="bg-transparent"
              onClick={() => {
                toggleDropdown("options")
              }}
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen.options ? "true" : "false"}
            >
              Opções  <span>{isDropdownOpen.options ? "▲" : "▼"}</span>
            </button>
            <ul
              className={`dropdown-menu dropdown-menu-dark ${
                isDropdownOpen.options ? "show" : ""
              }`}
            >
             
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    handleLogout();
toggleDropdown("propostas");
                  }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
