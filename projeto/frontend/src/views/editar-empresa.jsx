// src/pages/editar-empresa.jsx
import "../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

import SideBar from "../components/sidebaradm";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

import Logo from "../imgs/logo1.png";

function EditarEmpresa() {
  const navigate = useNavigate();
  const id = "3"; // ID da empresa (ajusta consoante o necessário)

  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3000/api/empresas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(response.data);
      } catch (error) {
        console.error("Erro ao carregar empresa:", error);
      }
    };

    fetchEmpresa();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3000/api/empresas/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Alterações guardadas com sucesso!");
      navigate("/empresa/perfil");
    } catch (error) {
      console.error("Erro ao guardar alterações:", error);
      alert("Erro ao guardar alterações. Tenta novamente.");
    }
  };

  return (
    <div className="main-wrapper">
      <div className="d-flex flex-column">
        <div className="d-md-flex flex-row justify-content-between">
          <div className="col-md-3 col-sm-1">
            <SideBar />
          </div>
          <div className="col-md-9 col-sm-12">
            <Navbar title="Editar Perfil da Empresa" />
            <div className="d-flex flex-grow-1">
              <div className="container-fluid main-content d-flex align-items-center justify-content-center">
                <div className="d-flex flex-column">
                  <div className="inicio-admin">
                    <br />
                    <div
                      className="container-fluid p-3 rounded"
                      style={{ background: "#f8f9fa", border: "1px solid #314B66", color: "#314B66" }}
                    >
                      <div className="row d-flex justify-content-center align-items-md-start align-items-sm-start">
                        <div className="col-md-3 col-sm-12">
                          <img src={Logo} alt="logo" className="w-100 company_logo" />
                        </div>
                        <div className="col-md-9 col-sm-12">
                          <div className="row mb-3">
                            <div className="col-md-6 col-sm-12">
                              <label className="form-label">Nome da Empresa</label>
                              <input
                                type="text"
                                className="form-control form_input"
                                name="nome"
                                value={formData.nome || ""}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-md-6 col-sm-12">
                              <label className="form-label">Email</label>
                              <input
                                type="email"
                                className="form-control form_input"
                                name="email"
                                value={formData.email || ""}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-md-6 col-sm-12">
                              <label className="form-label">Área de Trabalho</label>
                              <input
                                type="text"
                                className="form-control form_input"
                                name="area"
                                value={formData.area || ""}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-md-6 col-sm-12">
                              <label className="form-label">Ocupação</label>
                              <input
                                type="text"
                                className="form-control form_input"
                                name="ocupacao"
                                value={formData.ocupacao || ""}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-md-6 col-sm-12">
                              <label className="form-label">Telefone</label>
                              <input
                                type="tel"
                                className="form-control form_input"
                                name="telefone"
                                value={formData.telefone || ""}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-md-6 col-sm-12">
                              <label className="form-label">Localidade</label>
                              <input
                                type="text"
                                className="form-control form_input"
                                name="localizacao"
                                value={formData.localizacao || ""}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="d-flex justify-content-end mt-3">
                            <button className="btn btn-success" onClick={handleSave}>
                              Guardar Alterações
                            </button>
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

export default EditarEmpresa;
