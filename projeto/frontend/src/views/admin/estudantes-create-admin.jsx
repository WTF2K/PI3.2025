import "../../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";

import SideBar from "../../components/sidebaradm";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Logo from "../../imgs/logo1.png";

function EstudantesCreateAdmin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    curso: "",
    ano: "",
    idade: "",
    interesses: "",
    competencias: "",
    percurso: "",
    localizacao: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      idtuser: 4, // Tipo de utilizador: Estudante
      idade: parseInt(formData.idade) || 0,
      ano: parseInt(formData.ano) || 1
    };

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:3000/api/utilizadores", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 201 || res.data) {
        alert("Conta de estudante criada com sucesso!");
        navigate("/adm/estudantes");
      } else {
        alert("Erro ao criar conta.");
      }
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      if (error.response?.data?.message) {
        alert("Erro: " + error.response.data.message);
      } else {
        alert("Erro na comunicação com o servidor: " + (error.response?.data?.error || error.message));
      }
    } finally {
      setLoading(false);
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
            <Navbar title={"Criar Nova Conta de Estudante"} />
            <div className="d-flex flex-grow-1">
              <div className="container-fluid main-content d-flex align-items-center justify-content-center">
                <div className="d-flex flex-column w-100">
                  <div className="inicio-admin">
                    <br />
                    <div
                      className="container-fluid p-3 rounded"
                      style={{
                        background: "#f8f9fa",
                        border: "1px solid #314B66",
                        color: "#314B66",
                      }}
                    >
                      <div className="d-flex justify-content-md-end justify-content-center">
                        <Link
                          to={"/adm/estudantes"}
                          className="btn_custom bg-transparent text-decoration-none"
                        >
                          Voltar
                        </Link>
                      </div>
                      <form onSubmit={handleSubmit}>
                        <div className="row d-flex justify-content-center align-items-md-start align-items-sm-start">
                          <div className="col-md-3 col-sm-12">
                            <div className="image-hover-wrapper position-relative">
                              <img src={Logo} alt="" className="w-100 company_logo" />
                              <div className="hover-text mx-2">Foto do Estudante</div>
                            </div>
                          </div>
                          <div className="col-md-9 col-sm-12">
                            {/* Nome */}
                            <div className="mb-3">
                              <label className="form-label">Nome Completo *</label>
                              <input
                                type="text"
                                name="nome"
                                className="form-control form_input"
                                placeholder="Ex: João Silva"
                                onChange={handleChange}
                                value={formData.nome}
                                required
                              />
                            </div>

                            {/* Email */}
                            <div className="mb-3">
                              <label className="form-label">Email *</label>
                              <input
                                type="email"
                                name="email"
                                className="form-control form_input"
                                placeholder="joao.silva@estudante.com"
                                onChange={handleChange}
                                value={formData.email}
                                required
                              />
                            </div>

                            {/* Senha */}
                            <div className="mb-3">
                              <label className="form-label">Senha *</label>
                              <input
                                type="password"
                                name="senha"
                                className="form-control form_input"
                                placeholder="Senha temporária"
                                onChange={handleChange}
                                value={formData.senha}
                                required
                                minLength="6"
                              />
                              <small className="text-muted">
                                O estudante deve alterar a senha no primeiro login.
                              </small>
                            </div>

                            {/* Curso */}
                            <div className="mb-3">
                              <label className="form-label">Curso *</label>
                              <input
                                type="text"
                                name="curso"
                                className="form-control form_input"
                                placeholder="Ex: Engenharia Informática"
                                onChange={handleChange}
                                value={formData.curso}
                                required
                              />
                            </div>

                            {/* Ano e Idade */}
                            <div className="row mb-3">
                              <div className="col-md-6">
                                <label className="form-label">Ano do Curso *</label>
                                <select
                                  name="ano"
                                  className="form-control form_input"
                                  onChange={handleChange}
                                  value={formData.ano}
                                  required
                                >
                                  <option value="">Selecione...</option>
                                  <option value="1">1º Ano</option>
                                  <option value="2">2º Ano</option>
                                  <option value="3">3º Ano</option>
                                  <option value="4">4º Ano</option>
                                  <option value="5">5º Ano</option>
                                </select>
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">Idade</label>
                                <input
                                  type="number"
                                  name="idade"
                                  className="form-control form_input"
                                  placeholder="Ex: 20"
                                  onChange={handleChange}
                                  value={formData.idade}
                                  min="16"
                                  max="100"
                                />
                              </div>
                            </div>

                            {/* Localização */}
                            <div className="mb-3">
                              <label className="form-label">Localização</label>
                              <input
                                type="text"
                                name="localizacao"
                                className="form-control form_input"
                                placeholder="Ex: Lisboa, Portugal"
                                onChange={handleChange}
                                value={formData.localizacao}
                              />
                            </div>

                            {/* Percurso Académico */}
                            <div className="mb-3">
                              <label className="form-label">Percurso Académico</label>
                              <textarea
                                name="percurso"
                                className="form-control form_input"
                                rows="3"
                                placeholder="Descreva o percurso académico do estudante..."
                                onChange={handleChange}
                                value={formData.percurso}
                              />
                            </div>

                            {/* Interesses */}
                            <div className="mb-3">
                              <label className="form-label">Áreas de Interesse</label>
                              <textarea
                                name="interesses"
                                className="form-control form_input"
                                rows="3"
                                placeholder="Ex: Desenvolvimento Web, Inteligência Artificial..."
                                onChange={handleChange}
                                value={formData.interesses}
                              />
                            </div>

                            {/* Competências */}
                            <div className="mb-3">
                              <label className="form-label">Competências & Soft Skills</label>
                              <textarea
                                name="competencias"
                                className="form-control form_input"
                                rows="3"
                                placeholder="Ex: JavaScript, Python, Trabalho em equipa..."
                                onChange={handleChange}
                                value={formData.competencias}
                              />
                            </div>

                            {/* Botões */}
                            <div className="row mb-3">
                              <div className="col-md-6 col-sm-12">
                                <button
                                  type="button"
                                  className="btn btn-danger w-100 mt-3"
                                  onClick={() => navigate("/adm/estudantes")}
                                  disabled={loading}
                                >
                                  Cancelar
                                </button>
                              </div>
                              <div className="col-md-6 col-sm-12">
                                <button 
                                  type="submit" 
                                  className="btn btn-primary w-100 mt-3"
                                  disabled={loading}
                                >
                                  {loading ? "Criando..." : "Criar Conta"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
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

export default EstudantesCreateAdmin;