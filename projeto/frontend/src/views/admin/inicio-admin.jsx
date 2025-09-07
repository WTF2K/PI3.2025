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
} from "@fortawesome/free-solid-svg-icons";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

import SideBar from "../../components/sidebaradm";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Card from "../../components/card";

import Logo from "../../imgs/logo1.png";

function InicioAdmin() {
  const topRef = useRef(null);
  const [DataPropostas, setDataPropostas] = useState([]);
  const [allPropostas, setAllPropostas] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/api/propostas/", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        // Filtrar propostas dos últimos 5 dias
        const hoje = new Date();
        const cincoDiasAtras = new Date();
        cincoDiasAtras.setDate(hoje.getDate() - 5);

        const propostasRecentes = res.data.filter((proposta) => {
          if (!proposta.data_submissao) return false;
          
          const dataSubmissao = new Date(proposta.data_submissao);
          return dataSubmissao >= cincoDiasAtras && dataSubmissao <= hoje;
        });

        // Ordenar por data de submissão (mais recentes primeiro)
        propostasRecentes.sort((a, b) => new Date(b.data_submissao) - new Date(a.data_submissao));

        setAllPropostas(propostasRecentes);
        setDataPropostas(propostasRecentes);
      })
      .catch((error) => {
        alert("Erro de ligação à API: " + error.message);
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

  return (
    <div className="main-wrapper">
      <div className="d-flex flex-column">
        <div className="d-md-flex flex-row justify-content-between">
          <div className="col-md-3 col-sm-1">
            <SideBar />
          </div>
          <div className="col-md-9 col-sm-12">
            <Navbar title={"Propostas Recentes"} />
            <div className="d-flex flex-grow-1">
              <div className="container-fluid main-content d-flex align-items-center justify-content-center">
                <div className="d-flex flex-column">
                  <div className="inicio-admin">
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

                    {/* Indicador de filtro */}
                    <div className="mb-4">
                      <div className="alert alert-info d-flex align-items-center">
                        <FontAwesomeIcon icon={faCalendar} className="me-2" />
                        <div>
                          <strong>Propostas dos Últimos 5 Dias</strong>
                          <br />
                          <small>Mostrando {filteredPropostas.length} de {allPropostas.length} proposta{allPropostas.length !== 1 ? 's' : ''} recente{allPropostas.length !== 1 ? 's' : ''}</small>
                        </div>
                      </div>
                    </div>

                    {/* Cards com os dados reais */}
                    <div className="cards-wrapper d-flex flex-wrap gap-4 justify-content-center">
                      {filteredPropostas.length === 0 ? (
                        <div className="text-center w-100">
                          <div className="alert alert-warning">
                            <FontAwesomeIcon icon={faCalendar} className="me-2" />
                            <strong>{searchTerm ? "Nenhuma proposta encontrada" : "Nenhuma proposta recente"}</strong>
                            <br />
                            {searchTerm ? `Nenhuma proposta corresponde à pesquisa "${searchTerm}".` : "Não há propostas submetidas nos últimos 5 dias."}
                          </div>
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

export default InicioAdmin;
