import "../../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

import SideBar from "../../components/sidebarestudante";
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

function PropostasEstudante() {
  const topRef = useRef(null);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [propostas, setPropostas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Estados para filtros
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroLocalizacao, setFiltroLocalizacao] = useState("");
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroVaga, setFiltroVaga] = useState("");

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
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/");
      return;
    }
    const userParsed = JSON.parse(user);
    if (userParsed.tipoutilizador !== 4) {
      navigate("/");
      return;
    }
    setUserData(userParsed);
  }, [navigate]);

  useEffect(() => {
    if (!userData) return;

    const fetchPropostas = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/propostas");
        setPropostas(response.data);
      } catch (error) {
        console.error("Erro ao buscar propostas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPropostas();
  }, [userData]);

  if (!userData) return null;
  if (loading) return <div className="text-center mt-5">Carregando propostas...</div>;

  // Filtrar propostas conforme os filtros
  const propostasFiltradas = propostas.filter((p) => {
    // Categoria (case insensitive)
    if (filtroCategoria && !p.categoria.toLowerCase().includes(filtroCategoria.toLowerCase()))
      return false;
    // Localização (case insensitive)
    if (filtroLocalizacao && !p.localizacao?.toLowerCase().includes(filtroLocalizacao.toLowerCase()))
      return false;
    // Nome (da empresa)
    if (filtroNome && !p.nome.toLowerCase().includes(filtroNome.toLowerCase())) return false;
    // Vaga (nome da proposta)
    if (filtroVaga && !p.nome.toLowerCase().includes(filtroVaga.toLowerCase())) return false;

    return true;
  });

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

                    {/* Área de filtros */}
                    <div className="search-box my-4">
                      <div className="row g-2">
                        <div className="col-md-3">
                          <input
                            type="text"
                            placeholder="Filtrar por Categoria"
                            className="form-control"
                            value={filtroCategoria}
                            onChange={(e) => setFiltroCategoria(e.target.value)}
                          />
                        </div>
                        <div className="col-md-3">
                          <input
                            type="text"
                            placeholder="Filtrar por Localização"
                            className="form-control"
                            value={filtroLocalizacao}
                            onChange={(e) => setFiltroLocalizacao(e.target.value)}
                          />
                        </div>
                        <div className="col-md-3">
                          <input
                            type="text"
                            placeholder="Filtrar por Nome da Empresa"
                            className="form-control"
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                          />
                        </div>
                        <div className="col-md-3">
                          <input
                            type="text"
                            placeholder="Filtrar por Vaga"
                            className="form-control"
                            value={filtroVaga}
                            onChange={(e) => setFiltroVaga(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Detalhes selecionados */}
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
                          {/* ... Conteúdo dos detalhes ... (igual ao teu original) */}
                          <div className="d-inline-flex justify-content-between">
                            <div className="d-flex justify-content-md-start gap-1 justify-content-center align-items-center fs-4">
                              <Link
                                to={`/estudante/propostas/${selectedDetails.idproposta}`}
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
                      {propostasFiltradas.length === 0 && <p>Nenhuma proposta encontrada.</p>}
                      {propostasFiltradas.map((data, index) => (
                        <div className="card-component w-100" key={index}>
                          <CardModal
                            imagem={data.imagem || "/imgs/logo1.png"}
                            empresa={data.nome || "Empresa"}
                            areaTrabalho={data.nome}
                            ocupacao={data.categoria}
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

export default PropostasEstudante;
