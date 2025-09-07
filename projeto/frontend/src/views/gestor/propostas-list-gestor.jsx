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
  faPencilSquare,
  faTrashCan,
  faCalendar,
  faMapMarker,
  faAt,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

function PropostasGestor() {
  const topRef = useRef(null);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [propostas, setPropostas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Mapeamento tipos de proposta (idtproposta) e contrato (idtcontrato)
  const tiposPropostaMap = {
    1: "Full Time",
    2: "Part Time",
    3: "Estágio",
  };

  const contratosMap = {
    1: "Contrato a Termo",
    2: "Contrato Sem Termo",
    3: "Prestação de Serviços",
  };

  useEffect(() => {
    const fetchPropostas = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/propostas", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPropostas(response.data);
      } catch (error) {
        console.error("Erro ao buscar propostas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPropostas();
  }, []);

  // Filtrar propostas baseado no searchTerm
  const filteredPropostas = propostas.filter((proposta) => {
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
            <Navbar title={"Propostas"} />
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
                            <div className="d-flex justify-content-md-start gap-1 justify-content-center align-items-center fs-4">
                              <Link
                                to={`/gestor/propostas/${selectedDetails.idproposta}`}
                                className="text-warning"
                              >
                                <FontAwesomeIcon
                                  className="me-2"
                                  icon={faPencilSquare}
                                  data-tooltip-id="tooltip-info-2"
                                />
                              </Link>
                              <Link to={"edit"} className="text-danger">
                                <FontAwesomeIcon
                                  icon={faTrashCan}
                                  data-tooltip-id="tooltip-info-3"
                                />
                              </Link>
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
                          {/*first section*/}
                          <div className="row d-flex justify-content-center align-items-md-center align-items-sm-start">
                            <div className="col-md-3 col-sm-9">
                              {/* Se tens imagem no backend, mostra, senão pode usar logo padrão */}
                              <img
                                src={selectedDetails.imagem || "/imgs/logo1.png"}
                                alt="Logo da empresa"
                                className="w-100"
                              />
                            </div>
                            <div className="col-md-9 col-sm-12">
                              <h1
                                className="card-title fw-bolder"
                                style={{ color: "#314B66" }}
                              >
                                {selectedDetails.empresa?.nome || "Empresa"}
                              </h1>
                              <div className="fs-5 d-md-flex flex-row  align-items-center gap-4">
                                <p>
                                  <b className="me-2">
                                    <FontAwesomeIcon icon={faCalendar} />
                                  </b>
                                  {selectedDetails.data_submissao
                                    ? new Date(selectedDetails.data_submissao).toLocaleDateString()
                                    : "Data não disponível"}
                                </p>
                                <p>
                                  <b className="me-2">
                                    <FontAwesomeIcon icon={faMapMarker} />
                                  </b>
                                  {selectedDetails.localizacao || "Localização não disponível"}
                                </p>
                                <p>
                                  <b className="me-2">
                                    <FontAwesomeIcon icon={faAt} />
                                  </b>
                                  {selectedDetails.email || "email@empresa.com"}
                                </p>
                                <p>
                                  <b className="me-2">
                                    <FontAwesomeIcon icon={faPhone} />
                                  </b>
                                  {selectedDetails.telefone || "000000000"}
                                </p>
                              </div>
                              {/*second section*/}
                              <div className="fs-5 d-md-flex flex-row  align-items-center gap-4">
                                <p>
                                  <b className="tag-label rounded px-2 text-white">
                                    Área de trabalho
                                  </b>
                                  <br />
                                  {selectedDetails.nome}
                                </p>
                                <p>
                                  <b className="tag-label rounded px-2 text-white">
                                    Ocupação
                                  </b>
                                  <br />
                                  {selectedDetails.categoria}
                                </p>
                                <p>
                                  <b className="tag-label rounded px-2 text-white">
                                    Tipo de Proposta
                                  </b>
                                  <br />
                                  {tiposPropostaMap[selectedDetails.idtproposta] || selectedDetails.idtproposta}
                                </p>
                                <p>
                                  <b className="tag-label rounded px-2 text-white">
                                    Tipo de Contrato
                                  </b>
                                  <br />
                                  {contratosMap[selectedDetails.idtcontrato] || selectedDetails.idtcontrato}
                                </p>
                              </div>
                              {/*third section*/}
                              <h4 className="card-title">Detalhes da Oferta</h4>
                              <p>
                                <b className="tag-label rounded px-2 text-white">
                                  Descrição
                                </b>
                                <br />
                                {selectedDetails.descricao}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 cards-wrapper d-flex flex-wrap gap-0 justify-content-center">
                      {filteredPropostas.length === 0 && (
                        <div className="text-center w-100">
                          <div className="alert alert-info">
                            {searchTerm ? 
                              `Nenhuma proposta encontrada para "${searchTerm}".` : 
                              "Nenhuma proposta encontrada."
                            }
                          </div>
                        </div>
                      )}
                      {filteredPropostas.map((data, index) => (
                        <div className="card-component w-100" key={index}>
                          <CardModal
                            imagem={data.imagem || "/imgs/logo1.png"}
                            empresa={data.nome || "Empresa"}
                            areaTrabalho={data.nome} // Nome da proposta
                            ocupacao={data.categoria} // Categoria
                            isValidation={false}
                            onViewDetails={() => {
                              setSelectedDetails(data);
                              topRef.current?.scrollIntoView({
                                behavior: "smooth",
                              });
                            }}
                          />
                        </div>
                      ))}
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

export default PropostasGestor;
