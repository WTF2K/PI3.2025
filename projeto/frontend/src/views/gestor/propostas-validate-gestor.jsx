import "../../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

import SideBar from "../../components/sidebargestor";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import CardModal from "../../components/card_modal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faFilter,
  faCheckCircle,
  faTimesCircle,
  faCalendar,
  faMapMarker,
  faAt,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

import Logo from "../../imgs/logo1.png";

function PropostasValidateGestor() {
  const topRef = useRef(null);

  const [selectedDetails, setSelectedDetails] = useState(null);
  const [propostas, setPropostas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPropostasPendentes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/propostas/pendentes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPropostas(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao buscar propostas pendentes:", err);
      setErro("Erro ao carregar propostas pendentes.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropostasPendentes();
  }, []);

  const handleValidar = async (propostaId, validada) => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      
      await axios.put(`http://localhost:3000/api/propostas/${propostaId}/validar`, {
        validada: validada,
        validado_por: user?.iduser || null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Atualizar a lista de propostas pendentes
      await fetchPropostasPendentes();
      
      alert(validada ? "Proposta aprovada com sucesso!" : "Proposta rejeitada com sucesso!");
    } catch (err) {
      console.error("Erro ao validar proposta:", err);
      alert("Erro ao validar proposta. Tente novamente.");
    }
  };

  // Filtrar propostas baseado no searchTerm
  const filteredPropostas = propostas.filter((proposta) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      proposta.nome?.toLowerCase().includes(searchLower) ||
      proposta.categoria?.toLowerCase().includes(searchLower) ||
      proposta.localizacao?.toLowerCase().includes(searchLower) ||
      proposta.vaga?.toLowerCase().includes(searchLower) ||
      proposta.descricao?.toLowerCase().includes(searchLower) ||
      proposta.empresa?.nome?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="main-wrapper">
      <div className="d-flex flex-column">
        <div className="d-md-flex flex-row justify-content-between">
          <div className="col-md-3 col-sm-1">
            <SideBar />
          </div>
          <div className="col-md-9 col-sm-12">
            <Navbar title={"Validar Propostas"} />
            <div className="d-flex flex-grow-1">
              <div className="container-fluid main-content d-flex justify-content-center">
                <div className="d-flex flex-column">
                  <div className="inicio-admin">
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
                    <div className="mx-3">
                      {selectedDetails && (
                        <div
                          className="card mb-4 p-3 w-100"
                          style={{
                            background: "#f8f9fa",
                            border: "1px solid #314B66",
                          }}
                          ref={topRef}
                        >
                          <div className="d-inline-flex justify-content-between">
                            <div className="d-flex justify-content-md-start gap-1 justify-content-center align-items-center fs-2">
                              <FontAwesomeIcon
                                className="me-2 text-success"
                                icon={faCheckCircle}
                                onClick={() => handleValidar(selectedDetails.idproposta, true)}
                                style={{ cursor: 'pointer' }}
                              />
                              <FontAwesomeIcon
                                className="text-danger"
                                icon={faTimesCircle}
                                onClick={() => handleValidar(selectedDetails.idproposta, false)}
                                style={{ cursor: 'pointer' }}
                              />
                            </div>
                            <div className="d-flex justify-content-md-end justify-content-center">
                              <button
                                className="btn_custom bg-transparent"
                                onClick={() => setSelectedDetails(null)}
                              >
                                Voltar
                              </button>
                            </div>
                          </div>

                          <div className="row d-flex justify-content-center align-items-md-center align-items-sm-start">
                            <div className="col-md-3 col-sm-9">
                              <img src={Logo} alt="" className="w-100" />
                            </div>
                            <div className="col-md-9 col-sm-12">
                              <h1 className="card-title fw-bolder" style={{ color: "#314B66" }}>
                                {selectedDetails.nome}
                              </h1>
                              <div className="fs-5 d-md-flex flex-row gap-4">
                                <p><b><FontAwesomeIcon icon={faCalendar} className="me-2" /></b>{selectedDetails.data_submissao}</p>
                                <p><b><FontAwesomeIcon icon={faMapMarker} className="me-2" /></b>{selectedDetails.localizacao}</p>
                              </div>
                              <div className="fs-5 d-md-flex flex-row gap-4">
                                <p><b className="tag-label rounded px-2 text-white">Área</b><br />{selectedDetails.categoria}</p>
                                <p><b className="tag-label rounded px-2 text-white">Vaga</b><br />{selectedDetails.vaga}</p>
                              </div>
                              <h4 className="card-title">Detalhes da Proposta</h4>
                              <p><b className="tag-label rounded px-2 text-white">Descrição</b><br />{selectedDetails.descricao}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Lista de cartões */}
                    <div className="mt-3 cards-wrapper d-flex flex-wrap gap-0 justify-content-center">
                      {loading ? (
                        <p>A carregar propostas pendentes...</p>
                      ) : erro ? (
                        <p className="text-danger">{erro}</p>
                      ) : filteredPropostas.length === 0 ? (
                        <div className="text-center w-100">
                          <div className="alert alert-info">
                            {searchTerm ? 
                              `Nenhuma proposta encontrada para "${searchTerm}".` : 
                              "Não há propostas pendentes de validação."
                            }
                          </div>
                        </div>
                      ) : (
                        filteredPropostas.map((data, index) => (
                          <div className="card-component w-100" key={index}>
                            <CardModal
                              imagem={Logo}
                              empresa={data.empresa?.nome}
                              areaTrabalho={data.categoria}
                              ocupacao={data.vaga}
                              isValidation={true}
                              onViewDetails={() => {
                                setSelectedDetails(data);
                                topRef.current?.scrollIntoView({ behavior: "smooth" });
                              }}
                              onValidar={(validada) => handleValidar(data.idproposta, validada)}
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

export default PropostasValidateGestor;
