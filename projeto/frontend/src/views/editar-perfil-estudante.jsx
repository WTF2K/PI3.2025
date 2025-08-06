// src/perfil-estudante.jsx
import "../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";  // <-- useParams para obter id da rota
import React, { useEffect, useState } from "react";
import axios from "axios";

import SideBar from "../components/sidebaradm";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

import Logo from "../imgs/logo1.png";

function EditarPerfilEstudante() {
  const navigate = useNavigate();
  const { id } = useParams(); // obter id do URL dinamicamente

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    interesses: "",
    percurso: "",
    curso: "",
    telefone: "",
    localizacao: "",
    ano: "",
    competencias: "",
  });

  useEffect(() => {
    const fetchUtilizador = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3000/api/utilizadores/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(response.data);
      } catch (error) {
        console.error("Erro ao carregar utilizador:", error);
      }
    };
    fetchUtilizador();
  }, [id]);

  // Atualizar formData ao editar input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submeter dados atualizados
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3000/api/utilizadores/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Perfil atualizado com sucesso!");
      navigate("/estudante/perfil");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("Erro ao atualizar perfil. Tenta novamente.");
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
            <Navbar title={"Editar Perfil do Estudante"} />
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
                          <img src={Logo} alt="" className="w-100 company_logo" />
                        </div>
                        <div className="col-md-9 col-sm-12">
                          <div className="row mb-3">
                            <div className="col-md-6 col-sm-12">
                              <label className="form-label">Nome Completo</label>
                              <input
                                type="text"
                                name="nome"
                                className="form-control form_input"
                                value={formData.nome || ""}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-md-6 col-sm-12">
                              <label className="form-label">Email</label>
                              <input
                                type="email"
                                name="email"
                                className="form-control form_input"
                                value={formData.email || ""}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-md-6 col-sm-12">
                              <label className="form-label">Área de Interesse Pessoal</label>
                              <input
                                type="text"
                                name="interesses"
                                className="form-control form_input"
                                value={formData.interesses || ""}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-md-6 col-sm-12">
                              <label className="form-label">Percurso Profissional</label>
                              <input
                                type="text"
                                name="percurso"
                                className="form-control form_input"
                                value={formData.percurso || ""}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-md-6 col-sm-12">
                              <label className="form-label">Curso</label>
                              <input
                                type="text"
                                name="curso"
                                className="form-control form_input"
                                value={formData.curso || ""}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-md-3 col-sm-12">
                              <label className="form-label">Telemóvel</label>
                              <input
                                type="tel"
                                name="telefone"
                                className="form-control form_input"
                                value={formData.telefone || ""}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-md-3 col-sm-12">
                              <label className="form-label">Localidade</label>
                              <input
                                type="text"
                                name="localizacao"
                                className="form-control form_input"
                                value={formData.localizacao || ""}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-md-2 col-4">
                              <label className="form-label">Ano</label>
                              <input
                                type="number"
                                name="ano"
                                className="form-control form_input"
                                value={formData.ano || ""}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-12">
                              <label className="form-label">Competências & Soft Skills</label>
                              <textarea
                                name="competencias"
                                className="form-control form_input"
                                rows={5}
                                value={formData.competencias || ""}
                                onChange={handleChange}
                              />
                              <p>{(formData.competencias?.length || 0)}/500</p>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-12">
                              <button className="btn btn-primary" onClick={handleSave}>
                                Guardar Alterações
                              </button>
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

export default EditarPerfilEstudante;
