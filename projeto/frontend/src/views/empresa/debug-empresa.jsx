import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DebugEmpresa() {
  const [debugInfo, setDebugInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const iduser = localStorage.getItem("iduser");
    const idempresa = localStorage.getItem("idempresa");
    const nome = localStorage.getItem("nome");
    const profile = localStorage.getItem("profile");

    setDebugInfo({
      token: token ? "Presente" : "Ausente",
      iduser: iduser || "Ausente",
      idempresa: idempresa || "Ausente",
      nome: nome || "Ausente",
      profile: profile || "Ausente",
      hasToken: !!token,
      hasIdUser: !!iduser
    });

    // Se não tem token, redirecionar para login
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h2>Debug - Empresa</h2>
          <div className="card">
            <div className="card-body">
              <h5>Informações do LocalStorage:</h5>
              <ul>
                <li><strong>Token:</strong> {debugInfo.token}</li>
                <li><strong>ID User:</strong> {debugInfo.iduser}</li>
                <li><strong>ID Empresa:</strong> {debugInfo.idempresa}</li>
                <li><strong>Nome:</strong> {debugInfo.nome}</li>
                <li><strong>Profile:</strong> {debugInfo.profile}</li>
              </ul>
              
              <h5>Status:</h5>
              <ul>
                <li><strong>Tem Token:</strong> {debugInfo.hasToken ? "Sim" : "Não"}</li>
                <li><strong>Tem ID User:</strong> {debugInfo.hasIdUser ? "Sim" : "Não"}</li>
              </ul>

              <div className="mt-3">
                <button 
                  className="btn btn-primary me-2"
                  onClick={() => navigate("/empresa/dashboard")}
                >
                  Ir para Dashboard
                </button>
                <button 
                  className="btn btn-secondary me-2"
                  onClick={() => navigate("/empresa/inicio")}
                >
                  Ir para Início
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DebugEmpresa;
