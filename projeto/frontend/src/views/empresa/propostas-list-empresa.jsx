import "../../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from "react-router-dom"; // adicionei useNavigate
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

import SideBar from "../../components/sidebarempresa";
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
  faToggleOn,
  faToggleOff,
  faRotateLeft,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

function PropostasEmpresa() {
  const topRef = useRef(null);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [propostas, setPropostas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todas'); // 'todas', 'ativas', 'inativas', 'atribuidas'
  const [searchTerm, setSearchTerm] = useState('');

  // NOVO: estado para guardar dados do utilizador e navegar
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

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

  // NOVO: validação do utilizador no carregamento do componente
  useEffect(() => {
    // Verificar se o utilizador está autenticado
    const token = localStorage.getItem("token");
    const iduser = localStorage.getItem("iduser");
    const idempresa = localStorage.getItem("idempresa");
    const nome = localStorage.getItem("nome");
    const profile = localStorage.getItem("profile");
    
    if (!token || !iduser) {
      navigate("/"); // não está logado, manda para /
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
    // só carregar propostas se userData estiver definido (validação ok)
    if (!userData) return;

    const fetchPropostas = async () => {
      try {
        const token = localStorage.getItem("token");
        let url = `http://localhost:3000/api/propostas/empresa/${userData.idempresa}`;
        
        // Aplicar filtros baseados no estado
        switch (filter) {
          case 'ativas':
            url = `http://localhost:3000/api/propostas/empresa/${userData.idempresa}/ativas`;
            break;
          case 'atribuidas':
            url = `http://localhost:3000/api/propostas/empresa/${userData.idempresa}/atribuidas`;
            break;
          default:
            // 'todas' e 'inativas' usam a mesma URL, filtramos depois
            break;
        }
        
        const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        let propostasData = response.data;
        
        // Filtrar propostas inativas se necessário
        if (filter === 'inativas') {
          propostasData = propostasData.filter(p => !p.ativa);
        }
        
        // Aplicar filtro de pesquisa
        if (searchTerm) {
          propostasData = propostasData.filter(p => 
            p.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.localizacao?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        setPropostas(propostasData);
      } catch (error) {
        console.error("Erro ao buscar propostas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPropostas();
  }, [userData, filter, searchTerm]);

  // NOVO: Função para ativar/desativar proposta
  const handleToggleStatus = async (idproposta, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3000/api/propostas/${idproposta}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        alert(response.data.message);
        // Recarregar propostas
        window.location.reload();
      }
    } catch (error) {
      alert("Erro ao alterar status: " + (error.response?.data?.message || error.message));
    }
  };

  // NOVO: Função para reativar proposta
  const handleReativar = async (idproposta) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3000/api/propostas/${idproposta}/reativar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        alert(response.data.message);
        // Recarregar propostas
        window.location.reload();
      }
    } catch (error) {
      alert("Erro ao reativar proposta: " + (error.response?.data?.message || error.message));
    }
  };

  // NOVO: enquanto userData é null, não renderiza nada (loading interno)
  if (!userData) {
    return null; // ou loading spinner, se preferires
  }

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
            <Navbar title={"Minhas Propostas"} />
            <div className="d-flex flex-grow-1">
              <div className="container-fluid main-content d-flex justify-content-center">
                <div className="d-flex flex-column">
                  <div className="inicio-admin">
                    {/* Filtros e pesquisa */}
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

                    {/* Filtros de status */}
                    <div className="mb-3">
                      <div className="btn-group" role="group">
                        <button
                          type="button"
                          className={`btn ${filter === 'todas' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setFilter('todas')}
                        >
                          Todas
                        </button>
                        <button
                          type="button"
                          className={`btn ${filter === 'ativas' ? 'btn-success' : 'btn-outline-success'}`}
                          onClick={() => setFilter('ativas')}
                        >
                          Ativas
                        </button>
                        <button
                          type="button"
                          className={`btn ${filter === 'inativas' ? 'btn-warning' : 'btn-outline-warning'}`}
                          onClick={() => setFilter('inativas')}
                        >
                          Inativas
                        </button>
                        <button
                          type="button"
                          className={`btn ${filter === 'atribuidas' ? 'btn-info' : 'btn-outline-info'}`}
                          onClick={() => setFilter('atribuidas')}
                        >
                          Atribuídas
                        </button>
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
                                to={`/empresas/propostas/${selectedDetails.idproposta}`}
                                className="text-warning"
                                title="Editar proposta"
                              >
                                <FontAwesomeIcon
                                  className="me-2"
                                  icon={faPencilSquare}
                                  data-tooltip-id="tooltip-info-2"
                                />
                              </Link>
                              
                              {/* Botões de ação baseados no status */}
                              {selectedDetails.ativa ? (
                                <button
                                  className="btn btn-sm btn-outline-danger me-2"
                                  onClick={() => handleToggleStatus(selectedDetails.idproposta, true)}
                                  title="Desativar proposta"
                                >
                                  <FontAwesomeIcon icon={faToggleOff} />
                                </button>
                              ) : (
                                <button
                                  className="btn btn-sm btn-outline-success me-2"
                                  onClick={() => handleToggleStatus(selectedDetails.idproposta, false)}
                                  title="Ativar proposta"
                                >
                                  <FontAwesomeIcon icon={faToggleOn} />
                                </button>
                              )}
                              
                              {!selectedDetails.ativa && !selectedDetails.atribuida_estudante && (
                                <button
                                  className="btn btn-sm btn-outline-primary me-2"
                                  onClick={() => handleReativar(selectedDetails.idproposta)}
                                  title="Reativar proposta"
                                >
                                  <FontAwesomeIcon icon={faRotateLeft} />
                                </button>
                              )}
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
                              <div className="d-flex justify-content-between align-items-start">
                                <h1
                                  className="card-title fw-bolder"
                                  style={{ color: "#314B66" }}
                                >
                                  {selectedDetails.empresa?.nome || "Empresa"}
                                </h1>
                                <div className="d-flex gap-2">
                                  {selectedDetails.ativa ? (
                                    <span className="badge bg-success">Ativa</span>
                                  ) : (
                                    <span className="badge bg-warning">Inativa</span>
                                  )}
                                  {selectedDetails.atribuida_estudante && (
                                    <span className="badge bg-info">Atribuída</span>
                                  )}
                                </div>
                              </div>
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
                              
                              {/* Informações de atribuição */}
                              {selectedDetails.atribuida_estudante && (
                                <div className="mt-3 p-3 bg-light rounded">
                                  <h5>Informações de Atribuição</h5>
                                  <p><strong>Atribuída em:</strong> {selectedDetails.data_atribuicao ? new Date(selectedDetails.data_atribuicao).toLocaleDateString() : 'Data não disponível'}</p>
                                  <p><strong>ID do Estudante:</strong> {selectedDetails.id_estudante_atribuido || 'Não especificado'}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 cards-wrapper d-flex flex-wrap gap-0 justify-content-center">
                      {propostas.length === 0 && (
                        <div className="text-center w-100">
                          <p>Nenhuma proposta encontrada para os filtros selecionados.</p>
                          <Link to="/empresa/propostas/add" className="btn btn-primary">
                            Criar Nova Proposta
                          </Link>
                        </div>
                      )}
                      {propostas.map((data, index) => (
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

export default PropostasEmpresa;
