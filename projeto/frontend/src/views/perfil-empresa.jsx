// src/perfil-empresa.jsx
import "../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

import SideBar from "../components/sidebaradm";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

import Logo from "../imgs/logo1.png";

function PerfilEmpresa() {
  const navigate = useNavigate();
  const id = "3"; // substituir com id dinâmico real

  const [empresaData, setEmpresaData] = useState({});

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3000/api/empresas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmpresaData(response.data);
      } catch (error) {
        console.error("Erro ao obter dados da empresa:", error);
      }
    };
    fetchEmpresa();
  }, [id]);

  return (
    <div className="main-wrapper">
      <div className="d-flex flex-column">
        <div className="d-md-flex flex-row justify-content-between">
          <div className="col-md-3 col-sm-1">
            <SideBar />
          </div>
          <div className="col-md-9 col-sm-12">
            <Navbar title={"Perfil da Empresa"} />
            <div className="d-flex flex-grow-1">
              <div className="container-fluid main-content d-flex align-items-center justify-content-center">
                <div className="d-flex flex-column">
                  <div className="inicio-admin">
                    <br />
                    <div
                      className="container-fluid p-3 rounded"
                      style={{ background: "#f8f9fa", border: "1px solid #314B66", color: "#314B66" }}
                    >
                      <div className="d-flex justify-content-md-end justify-content-center mb-3">
                        <button
                          className="btn btn-primary"
                          onClick={() => navigate(`/empresa/${id}/editar`)}
                        >
                          Editar Perfil
                        </button>
                      </div>

                      <div className="row d-flex justify-content-center align-items-md-start align-items-sm-start">
                        <div className="col-md-3 col-sm-12">
                          <img src={Logo} alt="" className="w-100 company_logo" />
                        </div>
                        <div className="col-md-9 col-sm-12">
                          <div className="row mb-3">
                            <div className="col-md-6 col-sm-12">
                              <label className="form-label">Nome da Empresa</label>
                              <input
                                type="text"
                                className="form-control form_input"
                                value={empresaData.nome || ""}
                                readOnly
                              />
                            </div>
                            <div className="col-md-6 col-sm-12">
                              <label className="form-label">Email</label>
                              <input
                                type="email"
                                className="form-control form_input"
                                value={empresaData.email || ""}
                                readOnly
                              />
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-md-6 col-sm-12">
                              <label className="form-label">Área de Trabalho</label>
                              <input
                                type="text"
                                className="form-control form_input"
                                value={empresaData.area_trabalho || ""}
                                readOnly
                              />
                            </div>
                            <div className="col-md-6 col-sm-12">
                              <label className="form-label">Ocupação</label>
                              <input
                                type="text"
                                className="form-control form_input"
                                value={empresaData.ocupacao || ""}
                                readOnly
                              />
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-md-6 col-sm-12">
                              <label className="form-label">Telefone</label>
                              <input
                                type="text"
                                className="form-control form_input"
                                value={empresaData.telefone || ""}
                                readOnly
                              />
                            </div>
                            <div className="col-md-6 col-sm-12">
                              <label className="form-label">Localização</label>
                              <input
                                type="text"
                                className="form-control form_input"
                                value={empresaData.localizacao || ""}
                                readOnly
                              />
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                    <br />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PerfilEmpresa;
