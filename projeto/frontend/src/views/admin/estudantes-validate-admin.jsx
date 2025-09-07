import "../../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

import SideBar from "../../components/sidebaradm";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import CardModal from "../../components/card_modal_duo";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faFilter,
  faCheckCircle,
  faTimesCircle,
  faGraduationCap,
  faMapMarker,
  faAt,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

import Logo from "../../imgs/logo1.png";

function EstudantesValidateAdmin() {
  const topRef = useRef(null);

  const [selectedDetails, setSelectedDetails] = useState(null);
  const [estudantes, setEstudantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEstudantesPedidoRemocao = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/utilizadores/estudantes/pedidos-remocao", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEstudantes(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao buscar pedidos de remoção:", err);
      setErro("Erro ao carregar pedidos de remoção.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstudantesPedidoRemocao();
  }, []);

  const handleValidarRemocao = async (estudanteId, aprovar) => {
    try {
      const token = localStorage.getItem("token");
      
      const endpoint = aprovar ? 'aprovar-remocao' : 'rejeitar-remocao';
      
      await axios.put(`http://localhost:3000/api/utilizadores/${estudanteId}/${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Atualizar a lista de pedidos
      await fetchEstudantesPedidoRemocao();
      
      alert(aprovar ? "Pedido de remoção aprovado com sucesso!" : "Pedido de remoção rejeitado com sucesso!");
    } catch (err) {
      console.error("Erro ao validar pedido de remoção:", err);
      alert("Erro ao validar pedido. Tente novamente.");
    }
  };

  // Filtrar estudantes baseado no searchTerm
  const filteredEstudantes = estudantes.filter((estudante) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      estudante.nome?.toLowerCase().includes(searchLower) ||
      estudante.email?.toLowerCase().includes(searchLower) ||
      estudante.curso?.toLowerCase().includes(searchLower) ||
      estudante.percurso?.toLowerCase().includes(searchLower)
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
            <Navbar title={"Validar Pedidos de Remoção"} />
            <div className="d-flex flex-grow-1">
              <div className="container-fluid main-content d-flex justify-content-center">
                <div className="d-flex flex-column">
                  <div className="inicio-admin">
                    <div className="search-box my-4">
                      <div className="d-flex flex-row">
                        <div className="col-5">
                          <input
                            type="text"
                            placeholder="Pesquisar pedidos de remoção..."
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

                    {/* Detalhes do estudante */}
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
                                onClick={() => handleValidarRemocao(selectedDetails.iduser, true)}
                                style={{ cursor: 'pointer' }}
                                title="Aprovar remoção"
                              />
                              <FontAwesomeIcon
                                className="text-danger"
                                icon={faTimesCircle}
                                onClick={() => handleValidarRemocao(selectedDetails.iduser, false)}
                                style={{ cursor: 'pointer' }}
                                title="Rejeitar pedido"
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
                                <p><b><FontAwesomeIcon icon={faGraduationCap} className="me-2" /></b>{selectedDetails.ano}º ano</p>
                                <p><b><FontAwesomeIcon icon={faMapMarker} className="me-2" /></b>{selectedDetails.localizacao || "Portugal"}</p>
                              </div>
                              <div className="fs-5 d-md-flex flex-row gap-4">
                                <p><b><FontAwesomeIcon icon={faAt} className="me-2" /></b>{selectedDetails.email}</p>
                                <p><b><FontAwesomeIcon icon={faPhone} className="me-2" /></b>{selectedDetails.telefone || "N/A"}</p>
                              </div>
                              <div className="fs-5 d-md-flex flex-row gap-4">
                                <p><b className="tag-label rounded px-2 text-white">Curso</b><br />{selectedDetails.curso}</p>
                                <p><b className="tag-label rounded px-2 text-white">Percurso</b><br />{selectedDetails.percurso}</p>
                              </div>
                              <h4 className="card-title">Motivo do Pedido</h4>
                              <p><b className="tag-label rounded px-2 text-white">Interesses</b><br />{selectedDetails.interesses}</p>
                              <p><b className="tag-label rounded px-2 text-white">Competências</b><br />{selectedDetails.competencias}</p>
                              
                              <div className="alert alert-warning mt-3">
                                <strong>Atenção:</strong> Este estudante solicitou a remoção da plataforma. 
                                Aprovar irá desativar permanentemente a conta.
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Lista de cartões */}
                    <div className="mt-3 cards-wrapper d-flex flex-wrap gap-0 justify-content-center">
                      {loading ? (
                        <p>A carregar pedidos de remoção...</p>
                      ) : erro ? (
                        <p className="text-danger">{erro}</p>
                      ) : filteredEstudantes.length === 0 ? (
                        <div className="text-center w-100">
                          <div className="alert alert-info">
                            {searchTerm ? 
                              `Nenhum pedido encontrado para "${searchTerm}".` : 
                              "Não há pedidos de remoção pendentes."
                            }
                          </div>
                        </div>
                      ) : (
                        filteredEstudantes.map((data, index) => (
                          <div className="card-component w-100" key={index}>
                            <CardModal
                              imagem={Logo}
                              empresa={data.nome}
                              areaTrabalho={data.percurso}
                              ocupacao={data.curso}
                              isValidation={true}
                              labelEmpresa="Nome"
                              labelAreaTrabalho="Percurso Académico"
                              onViewDetails={() => {
                                setSelectedDetails(data);
                                topRef.current?.scrollIntoView({ behavior: "smooth" });
                              }}
                              onValidar={(aprovar) => handleValidarRemocao(data.iduser, aprovar)}
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

export default EstudantesValidateAdmin;