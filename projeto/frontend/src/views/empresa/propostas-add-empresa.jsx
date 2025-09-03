import "../../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

import SideBar from "../../components/sidebarempresa";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Logo from "../../imgs/logo1.png";

function PropostasADDEmpresa() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    localizacao: "",
    descricao: "",
    vaga: "",
    idtproposta: "",
    idtcontrato: "",
  });

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Verificar se o utilizador está autenticado
    const token = localStorage.getItem("token");
    const iduser = localStorage.getItem("iduser");
    const idempresa = localStorage.getItem("idempresa");
    const nome = localStorage.getItem("nome");
    const profile = localStorage.getItem("profile");
    
    if (!token || !iduser) {
      navigate("/");
      return;
    }
    
    // Verificar se é empresa (tipoutilizador = 3)
    const userData = {
      iduser: iduser,
      idempresa: idempresa,
      nome: nome,
      tipoutilizador: 3 // Empresa
    };
    
    setUserData(userData);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date().toISOString().split("T")[0];

    const payload = {
      nome: formData.nome,
      categoria: formData.categoria,
      localizacao: formData.localizacao,
      descricao: formData.descricao,
      vaga: formData.vaga,
      idtproposta: parseInt(formData.idtproposta),
      idtcontrato: parseInt(formData.idtcontrato),
      data_submissao: today,
      iduser: userData?.iduser,
      idempresa: userData?.idempresa,
      idtuser: userData?.tipoutilizador // ← este é o campo usado no backend
    };

    try {
      const res = await axios.post("http://localhost:3000/api/propostas", payload);
      if (res.status === 201 || res.data) {
        alert("Proposta adicionada com sucesso!");
        navigate("/empresa/propostas");
      } else {
        alert("Erro ao adicionar proposta.");
      }
    } catch (error) {
      alert("Erro na comunicação com o servidor: " + (error.response?.data?.error || error.message));
    }
  };

  if (!userData) return null;

  return (
    <div className="main-wrapper">
      <div className="d-flex flex-column">
        <div className="d-md-flex flex-row justify-content-between">
          <div className="col-md-3 col-sm-1">
            <SideBar />
          </div>
          <div className="col-md-9 col-sm-12">
            <Navbar title={"Adicionar Proposta"} />
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
                          to={"/empresa/propostas"}
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
                              <div className="hover-text mx-2">Mudar Imagem</div>
                            </div>
                          </div>
                          <div className="col-md-9 col-sm-12">
                            <div className="mb-3">
                              <label className="form-label">Título da Proposta</label>
                              <input
                                type="text"
                                name="nome"
                                className="form-control form_input"
                                placeholder="Ex: Desenvolvedor Frontend"
                                onChange={handleChange}
                                required
                              />
                            </div>

                            <div className="mb-3">
                              <label className="form-label">Categoria</label>
                              <input
                                type="text"
                                name="categoria"
                                className="form-control form_input"
                                onChange={handleChange}
                              />
                            </div>

                            <div className="mb-3">
                              <label className="form-label">Localização</label>
                              <input
                                type="text"
                                name="localizacao"
                                className="form-control form_input"
                                onChange={handleChange}
                              />
                            </div>

                            <div className="mb-3">
                              <label className="form-label">Descrição</label>
                              <textarea
                                name="descricao"
                                className="form-control form_input"
                                rows="4"
                                maxLength="500"
                                onChange={handleChange}
                              />
                            </div>

                            <div className="mb-3">
                              <label className="form-label">Detalhes da Vaga</label>
                              <textarea
                                name="vaga"
                                className="form-control form_input"
                                rows="4"
                                maxLength="500"
                                onChange={handleChange}
                              />
                            </div>

                            <div className="mb-3">
                              <label className="form-label">Tipo de Proposta</label>
                              <select
                                name="idtproposta"
                                className="form-control form_input"
                                onChange={handleChange}
                                required
                              >
                                <option value="">Escolha...</option>
                                <option value="1">Full Time</option>
                                <option value="2">Part Time</option>
                                <option value="3">Estágio</option>
                              </select>
                            </div>

                            <div className="mb-3">
                              <label className="form-label">Tipo de Contrato</label>
                              <select
                                name="idtcontrato"
                                className="form-control form_input"
                                onChange={handleChange}
                                required
                              >
                                <option value="">Escolha...</option>
                                <option value="1">Contrato a Termo</option>
                                <option value="2">Contrato Sem Termo</option>
                                <option value="3">Prestação de Serviços</option>
                              </select>
                            </div>

                            <div className="row mb-3">
                              <div className="col-md-6 col-sm-12">
                                <button
                                  type="button"
                                  className="btn btn-danger w-100 mt-3"
                                  onClick={() => navigate("/empresa/propostas")}
                                >
                                  Cancelar
                                </button>
                              </div>
                              <div className="col-md-6 col-sm-12">
                                <button type="submit" className="btn btn-primary w-100 mt-3">
                                  Adicionar
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

export default PropostasADDEmpresa;
