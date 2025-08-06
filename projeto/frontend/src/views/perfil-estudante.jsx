// src/perfil-estudante.jsx
import "../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

import SideBar from "../components/sidebarestudante";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

import Logo from "../imgs/logo1.png";

function PerfilEstudante() {
  const navigate = useNavigate();

  // Podes obter o id do estudante a partir de um token ou outro método
  // Aqui deixo um exemplo de id fixo (podes ajustar conforme necessidade)
  const id = "10"; // substituir pela forma de obter id real

  const [formData, setFormData] = useState({});
  const [count, setCount] = useState(0);

  useEffect(() => {
    const iduser = localStorage.getItem("iduser");
    console.log("iduser do localStorage:", iduser);

    if (!iduser) {
      alert("Utilizador não autenticado.");
      navigate("/"); // redireciona para login se não estiver autenticado
      return;
    }

    const fetchUtilizador = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = `http://localhost:3000/api/utilizadores/${iduser}`;
        console.log("URL do fetch:", url);

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Dados recebidos:", response.data);

        setFormData(response.data);
        setCount(response.data.competencias?.length || 0);
      } catch (error) {
        console.error("Erro ao carregar utilizador:", error);
        alert("Erro ao carregar dados do utilizador.");
      }
    };

    fetchUtilizador();
  }, [navigate]);

  return (
    <div className="main-wrapper">
      <div className="d-flex flex-column">
        <div className="d-md-flex flex-row justify-content-between">
          <div className="col-md-3 col-sm-1">
            <SideBar />
          </div>
          <div className="col-md-9 col-sm-12">
            <Navbar title={"Perfil do Estudante"} />
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
                          onClick={() => navigate(`/estudante/${id}`)}
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
                              <label className="form-label">Nome Completo</label>
                              <input
                                type="text"
                                className="form-control form_input"
                                value={formData.nome || ""}
                                readOnly
                              />
                            </div>
                            <div className="col-md-6 col-sm-12">
                              <label className="form-label">Email</label>
                              <input
                                type="email"
                                className="form-control form_input"
                                value={formData.email || ""}
                                readOnly
                              />
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-md-6 col-sm-12">
                              <label className="form-label">Área de Interesse Pessoal</label>
                              <input
                                type="text"
                                className="form-control form_input"
                                value={formData.interesses || ""}
                                readOnly
                              />
                            </div>
                            <div className="col-md-6 col-sm-12">
                              <label className="form-label">Percurso Profissional</label>
                              <input
                                type="text"
                                className="form-control form_input"
                                value={formData.percurso || ""}
                                readOnly
                              />
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-md-6 col-sm-12">
                              <label className="form-label">Curso</label>
                              <input
                                type="text"
                                className="form-control form_input"
                                value={formData.curso || ""}
                                readOnly
                              />
                            </div>
                            {/*
                            <div className="col-md-3 col-sm-12">
                              <label className="form-label">Telemóvel</label>
                              <input
                                type="tel"
                                className="form-control form_input"
                                value={formData.telefone || ""}
                                readOnly
                              />
                            </div>
                            <div className="col-md-3 col-sm-12">
                              <label className="form-label">Localidade</label>
                              <input
                                type="text"
                                className="form-control form_input"
                                value={formData.localizacao || ""}
                                readOnly
                              />
                            </div>
                            */}
                          </div>

                          <div className="row mb-3">
                            <div className="col-md-2 col-4">
                              <label className="form-label">Ano</label>
                              <input
                                type="number"
                                className="form-control form_input"
                                value={formData.ano || ""}
                                readOnly
                              />
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-12">
                              <label className="form-label">Competências & Soft Skills</label>
                              <textarea
                                className="form-control form_input"
                                rows={5}
                                value={formData.competencias || ""}
                                readOnly
                              />
                              <p>{count}/500</p>
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

export default PerfilEstudante;
