import "../../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams, useNavigate, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

import SideBar from "../../components/sidebarempresa";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Logo from "../../imgs/logo1.png";

function PropostasEditEmpresa() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null); // <-- adiciona este estado

  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    localizacao: "",
    descricao: "",
    vaga: "",
    idempresa: "",
    idtproposta: "",
    idtcontrato: "",
  });

  // Tipos de Proposta e Contrato (manuais)
  const tiposProposta = [
    { id: 1, nome: "Full Time" },
    { id: 2, nome: "Part Time" },
    { id: 3, nome: "Estágio" },
  ];

  const tiposContrato = [
    { id: 1, nome: "Contrato a Termo" },
    { id: 2, nome: "Contrato Sem Termo" },
    { id: 3, nome: "Prestação de Serviços" },
  ];

  // Empresas (opcional: aqui simular manualmente ou puxar da API)
  const empresas = [
    { id: 1, nome: "Empresa Alpha" },
    { id: 2, nome: "Empresa Beta" },
    { id: 3, nome: "Empresa Gama" },
  ];

  // Verificação do utilizador autenticado e tipo
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/api/propostas/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        const data = res.data;

        setFormData({
          nome: data.nome || "",
          categoria: data.categoria || "",
          localizacao: data.localizacao || "",
          descricao: data.descricao || "",
          vaga: data.vaga || "",
          idempresa: data.idempresa || "",
          idtproposta: data.idtproposta || "",
          idtcontrato: data.idtcontrato || "",
        });
      } catch (error) {
        console.error("Erro ao carregar os dados da proposta.", error);
        alert("Erro ao carregar os dados da proposta.");
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nome: formData.nome,
      categoria: formData.categoria,
      localizacao: formData.localizacao,
      descricao: formData.descricao,
      vaga: formData.vaga,
      idempresa: parseInt(formData.idempresa),
      idtproposta: parseInt(formData.idtproposta),
      idtcontrato: parseInt(formData.idtcontrato),
    };

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`http://localhost:3000/api/propostas/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status >= 200 && res.status < 300) {
        alert("Proposta editada com sucesso!");
        navigate("/empresa/propostas");
      } else {
        alert("Erro ao editar proposta.");
      }
    } catch (error) {
      alert("Erro na comunicação com o servidor: " + (error.response?.data?.error || error.message));
    }
  };

  // Evita renderizar antes de saber se user é válido
  if (!userData) return null;

  return (
    <div className="main-wrapper">
      <div className="d-flex flex-column">
        <div className="d-md-flex flex-row justify-content-between">
          <div className="col-md-3 col-sm-1">
            <SideBar />
          </div>
          <div className="col-md-9 col-sm-12">
            <Navbar title={"Editar Proposta"} />
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
                        {/* ... o resto do formulário permanece igual ... */}
                        {/* (não alterei esta parte para manter o teu layout) */}

                        <div className="row d-flex justify-content-center align-items-md-start align-items-sm-start">
                          <div className="col-md-3 col-sm-12">
                            <div className="image-hover-wrapper position-relative">
                              <img src={Logo} alt="" className="w-100 company_logo" />
                              <div className="hover-text mx-2">Mudar Imagem</div>
                            </div>
                          </div>

                          <div className="col-md-9 col-sm-12">
                            {/* Campos do formulário aqui */}

                            {/* Título */}
                            <div className="mb-3">
                              <label className="form-label">Título da Proposta</label>
                              <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                className="form-control form_input"
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
                                value={formData.categoria}
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
                                value={formData.localizacao}
                                className="form-control form_input"
                                onChange={handleChange}
                              />
                            </div>

                            {/* Descrição */}
                            <div className="mb-3">
                              <label className="form-label">Descrição</label>
                              <textarea
                                name="descricao"
                                value={formData.descricao}
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
                                value={formData.vaga}
                                className="form-control form_input"
                                rows="4"
                                maxLength="500"
                                onChange={handleChange}
                              />
                            </div>

                            {/* Empresa */}
                            <div className="mb-3">
                              <label className="form-label">Empresa</label>
                              <select
                                name="idempresa"
                                className="form-control form_input"
                                value={formData.idempresa}
                                onChange={handleChange}
                                required
                              >
                                <option value="">Escolha...</option>
                                {empresas.map((empresa) => (
                                  <option key={empresa.id} value={empresa.id}>
                                    {empresa.nome}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Tipo de Proposta */}
                            <div className="mb-3">
                              <label className="form-label">Tipo de Proposta</label>
                              <select
                                name="idtproposta"
                                className="form-control form_input"
                                value={formData.idtproposta}
                                onChange={handleChange}
                                required
                              >
                                <option value="">Escolha...</option>
                                {tiposProposta.map((tipo) => (
                                  <option key={tipo.id} value={tipo.id}>
                                    {tipo.nome}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Tipo de Contrato */}
                            <div className="mb-3">
                              <label className="form-label">Tipo de Contrato</label>
                              <select
                                name="idtcontrato"
                                className="form-control form_input"
                                value={formData.idtcontrato}
                                onChange={handleChange}
                                required
                              >
                                <option value="">Escolha...</option>
                                {tiposContrato.map((tipo) => (
                                  <option key={tipo.id} value={tipo.id}>
                                    {tipo.nome}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <button
                              type="submit"
                              className="btn btn-primary btn-block mt-4"
                            >
                              Editar Proposta
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropostasEditEmpresa;
