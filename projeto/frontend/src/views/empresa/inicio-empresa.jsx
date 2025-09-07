import "../../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faFilter,
  faCalendar,
  faMapMarker,
  faAt,
  faPhone,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import SideBar from "../../components/sidebarempresa";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Card from "../../components/card";

import Logo from "../../imgs/logo1.png";

function InicioEmpresa() {
  const topRef = useRef(null);
  const [DataPropostas, setDataPropostas] = useState([]);
  const [allPropostas, setAllPropostas] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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
    if (!userData) return;
    fetchData();
  }, [userData]);

  function fetchData() {
    const token = localStorage.getItem("token");
    axios
      .get(
        `http://localhost:3000/api/propostas/empresa/${userData?.idempresa}/ativas`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setAllPropostas(res.data);
        setDataPropostas(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro de ligação à API:", error);
        setLoading(false);
      });
  }

  // Filtrar propostas baseado no searchTerm
  const filteredPropostas = allPropostas.filter((proposta) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      proposta.nome?.toLowerCase().includes(searchLower) ||
      proposta.categoria?.toLowerCase().includes(searchLower) ||
      proposta.localizacao?.toLowerCase().includes(searchLower) ||
      proposta.vaga?.toLowerCase().includes(searchLower) ||
      proposta.descricao?.toLowerCase().includes(searchLower)
    );
  });

  if (!userData) return null;

  if (loading) {
    return <div className="text-center mt-5">Carregando propostas...</div>;
  }

  return (
    <div className="main-wrapper">
      <div className="d-flex flex-column">
        <div className="d-md-flex flex-row justify-content-between">
          <div className="col-md-3 col-sm-1">
            <SideBar />
          </div>
          <div className="col-md-9 col-sm-12">
            <Navbar title={"Início"} />
            <div className="d-flex flex-grow-1">
              <div className="container-fluid main-content d-flex align-items-center justify-content-center">
                <div className="d-flex flex-column">
                  <div className="inicio-admin">
                    {/* Banner de boas-vindas e dashboard */}
                    <div className="mb-4 p-3 rounded" style={{ background: "#f8f9fa", border: "1px solid #314B66" }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h4>Bem-vindo, {userData?.nome || 'Empresa'}!</h4>
                          <p className="mb-0">Gerencie suas propostas de emprego e acompanhe o progresso.</p>
                        </div>
                        <Link to="/empresa/dashboard" className="btn btn-primary">
                          <FontAwesomeIcon icon={faChartBar} className="me-2" />
                          Ver Dashboard
                        </Link>
                      </div>
                    </div>

                    {/* Search bar */}
                    <div className="search-box my-4">
                      <div className="d-flex flex-row">
                        <div className="col-5">
                          <input
                            type="text"
                            placeholder="Pesquisar propostas..."
                            className="search-input form-control form_input"
                            style={{
                              borderTopRightRadius: "0",
                              borderBottomRightRadius: "0",
                            }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <div className="d-flex flex-row justify-content-between">
                          <div className="col-3">
                            <button className="search-btn btn form_input rounded-0">
                              <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </button>
                          </div>
                          <div className="col-3">
                            <button className="filter-btn btn form_input rounded-0">
                              <FontAwesomeIcon icon={faFilter} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detalhes da proposta */}
                    {selectedDetails && (
                      <div
                        className="card mb-4 p-3 w-100"
                        style={{ background: "#f8f9fa", border: "1px solid #314B66" }}
                        ref={topRef}
                      >
                        <div className="d-flex justify-content-md-end justify-content-center">
                          <button
                            className="btn_custom bg-transparent"
                            onClick={() => setSelectedDetails(null)}
                          >
                            Voltar
                          </button>
                        </div>
                        <div className="row d-flex justify-content-center align-items-md-center align-items-sm-start">
                          <div className="col-md-3 col-sm-9">
                            <img
                              src={selectedDetails.imagem || Logo}
                              alt=""
                              className="w-100"
                            />
                          </div>
                          <div className="col-md-9 col-sm-12">
                            <h1 className="card-title fw-bolder" style={{ color: "#314B66" }}>
                              {selectedDetails.nome || "Empresa"}
                            </h1>
                            <div className="fs-5 d-md-flex flex-row align-items-center gap-4">
                              <p>
                                <b className="me-2"><FontAwesomeIcon icon={faCalendar} /></b>
                                {selectedDetails.data_submissao}
                              </p>
                              <p>
                                <b className="me-2"><FontAwesomeIcon icon={faMapMarker} /></b>
                                {selectedDetails.localizacao}
                              </p>
                              <p>
                                <b className="me-2"><FontAwesomeIcon icon={faAt} /></b>
                                {selectedDetails.email || "empresa@gmail.com"}
                              </p>
                              <p>
                                <b className="me-2"><FontAwesomeIcon icon={faPhone} /></b>
                                {selectedDetails.telefone || "921645222"}
                              </p>
                            </div>

                            {/* Segunda secção */}
                            <div className="fs-5 d-md-flex flex-row align-items-center gap-4">
                              <p>
                                <b className="tag-label rounded px-2 text-white">Área de trabalho</b>
                                <br />
                                {selectedDetails.categoria}
                              </p>
                              <p>
                                <b className="tag-label rounded px-2 text-white">Ocupação</b>
                                <br />
                                {selectedDetails.vaga}
                              </p>
                              <p>
                                <b className="tag-label rounded px-2 text-white">Tipo de Proposta</b>
                                <br />
                                {selectedDetails.tipoProposta || "Estágio"}
                              </p>
                            </div>

                            {/* Terceira secção */}
                            <h4 className="card-title">Detalhes da Oferta</h4>
                            <p>
                              <b className="tag-label rounded px-2 text-white">O que vai fazer</b>
                              <br />
                              {selectedDetails.descricao || "Sem descrição disponível."}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Cards com os dados reais */}
                    <div className="cards-wrapper d-flex flex-wrap gap-4 justify-content-center">
                      {filteredPropostas.length === 0 ? (
                        <div className="text-center w-100">
                          <div className="alert alert-info">
                            {searchTerm ? 
                              `Nenhuma proposta encontrada para "${searchTerm}".` : 
                              "Nenhuma proposta ativa encontrada."
                            }
                          </div>
                          {!searchTerm && (
                            <Link to="/empresa/propostas/add" className="btn btn-primary">
                              Criar Primeira Proposta
                            </Link>
                          )}
                        </div>
                      ) : (
                        filteredPropostas.map((data, index) => (
                          <div className="card-component" key={index}>
                            <Card
                              empresa={data.nome || "Empresa"}
                              localizacao={data.localizacao}
                              dataSubmissao={data.data_submissao}
                              categoria={data.categoria}
                              vaga={data.vaga}
                              imagem={Logo}
                              onViewDetails={() => {
                                setSelectedDetails(data);
                                topRef.current?.scrollIntoView({ behavior: "smooth" });
                              }}
                            />
                          </div>
                        ))
                      )}
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

export default InicioEmpresa;
