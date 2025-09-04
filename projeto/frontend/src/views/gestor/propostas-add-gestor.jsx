import "../../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

import SideBar from "../../components/sidebargestor";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Logo from "../../imgs/logo1.png";

function PropostasADDGestor() {
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

  // Lista de empresas disponíveis para o gestor escolher
  const [empresas, setEmpresas] = useState([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState({ idempresa: "", iduser: "" });

  // Carregar empresas (idempresa, nome) para o dropdown
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/empresas", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmpresas(res.data || []);
      } catch (error) {
        console.error("Erro a carregar empresas:", error);
        alert("Não foi possível carregar a lista de empresas.");
      }
    };
    fetchEmpresas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    if (!empresaSelecionada.idempresa || !empresaSelecionada.iduser) {
      alert("Selecione uma empresa válida.");
      return;
    }

    const payload = {
      nome: formData.nome,
      categoria: formData.categoria,
      localizacao: formData.localizacao,
      descricao: formData.descricao,
      vaga: formData.vaga,
      idtproposta: parseInt(formData.idtproposta),
      idtcontrato: parseInt(formData.idtcontrato),
      data_submissao: today,
      // Submeter em nome da empresa selecionada
      iduser: parseInt(empresaSelecionada.iduser),
      idempresa: parseInt(empresaSelecionada.idempresa),
      idtuser: 3     // Empresa
    };

    try {
      const res = await axios.post("http://localhost:3000/api/propostas", payload);
      if (res.status === 201 || res.data) {
        alert("Proposta adicionada com sucesso!");
        navigate("/gestor/inicio");
      } else {
        alert("Erro ao adicionar proposta.");
      }
    } catch (error) {
      alert("Erro na comunicação com o servidor: " + (error.response?.data?.error || error.message));
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
                          to={"/adm/propostas"}
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
                            {/* Empresa */}
                            <div className="mb-3">
                              <label className="form-label">Empresa</label>
                              <select
                                className="form-control form_input"
                                value={empresaSelecionada.idempresa}
                                onChange={(e) => {
                                  const idemp = e.target.value;
                                  const emp = empresas.find((x) => String(x.idempresa) === String(idemp));
                                  setEmpresaSelecionada({ idempresa: idemp, iduser: emp ? emp.iduser : "" });
                                }}
                                required
                              >
                                <option value="">Selecione a empresa...</option>
                                {empresas.map((emp) => (
                                  <option key={emp.idempresa} value={emp.idempresa}>
                                    {emp.nome} (ID {emp.idempresa})
                                  </option>
                                ))}
                              </select>
                              <small className="text-muted">
                                Esta proposta será submetida em nome da empresa selecionada.
                              </small>
                            </div>
                            {/* Nome */}
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

                            {/* Categoria */}
                            <div className="mb-3">
                              <label className="form-label">Categoria</label>
                              <input
                                type="text"
                                name="categoria"
                                className="form-control form_input"
                                onChange={handleChange}
                              />
                            </div>

                            {/* Localização */}
                            <div className="mb-3">
                              <label className="form-label">Localização</label>
                              <input
                                type="text"
                                name="localizacao"
                                className="form-control form_input"
                                onChange={handleChange}
                              />
                            </div>

                            {/* Descrição */}
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

                            {/* Vaga */}
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

                            {/* Tipo de Proposta */}
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

                            {/* Tipo de Contrato */}
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

                            {/* Botões */}
                            <div className="row mb-3">
                              <div className="col-md-6 col-sm-12">
                                <button
                                  type="button"
                                  className="btn btn-danger w-100 mt-3"
                                  onClick={() => navigate("/gestor/dashboard")}
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

export default PropostasADDGestor;
