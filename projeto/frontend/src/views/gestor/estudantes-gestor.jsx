import "../../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faSearch,
  faEye,
  faCheck,
  faTimes,
  faFilter,
  faUserCheck,
  faUserTimes,
  faPhone,
  faEnvelope,
  faCalendar,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";

import React, { useEffect, useState } from "react";
import axios from "axios";

import SideBar from "../../components/sidebargestor";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

function EstudantesGestor() {
  const [estudantes, setEstudantes] = useState([]);
  const [filteredEstudantes, setFilteredEstudantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [selectedEstudante, setSelectedEstudante] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEstudantes();
  }, []);

  useEffect(() => {
    filterEstudantes();
  }, [estudantes, searchTerm, filterStatus]);

  const fetchEstudantes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/utilizadores/estudantes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEstudantes(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar estudantes:", error);
      setLoading(false);
    }
  };

  const filterEstudantes = () => {
    let filtered = estudantes;

    // Filtrar por termo de pesquisa
    if (searchTerm) {
      filtered = filtered.filter(estudante =>
        estudante.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        estudante.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        estudante.curso?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por status (modo temporário)
    switch (filterStatus) {
      case "ativos":
        // Temporário: todos são considerados ativos
        break;
      case "inativos":
        // Temporário: nenhum é inativo
        filtered = [];
        break;
      case "pedidos-remocao":
        // Temporário: nenhum pedido de remoção
        filtered = [];
        break;
      default:
        break;
    }

    setFilteredEstudantes(filtered);
  };

  const handleViewDetails = (estudante) => {
    setSelectedEstudante(estudante);
    setShowModal(true);
  };

  const handleAprovarRemocao = async (id) => {
    if (!window.confirm("Tem certeza que deseja aprovar a remoção deste estudante?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3000/api/utilizadores/${id}/aprovar-remocao`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Estudante removido com sucesso!");
      fetchEstudantes(); // Recarregar dados
    } catch (error) {
      console.error("Erro ao aprovar remoção:", error);
      alert("Erro ao aprovar remoção do estudante.");
    }
  };

  const handleRejeitarRemocao = async (id) => {
    if (!window.confirm("Tem certeza que deseja rejeitar o pedido de remoção deste estudante?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3000/api/utilizadores/${id}/rejeitar-remocao`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Pedido de remoção rejeitado com sucesso!");
      fetchEstudantes(); // Recarregar dados
    } catch (error) {
      console.error("Erro ao rejeitar pedido:", error);
      alert("Erro ao rejeitar pedido de remoção.");
    }
  };

  const getStatusBadge = (estudante) => {
    // Temporário: todos são considerados ativos
    return <span className="badge bg-success">Ativo</span>;
  };

  if (loading) {
    return (
      <div className="main-wrapper">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-wrapper">
      <div className="d-flex flex-column">
        <div className="d-md-flex flex-row justify-content-between">
          <div className="col-md-3 col-sm-1">
            <SideBar />
          </div>
          <div className="col-md-9 col-sm-12 ">
            <Navbar title={"Gestão de Estudantes"} />
            <div className="d-flex flex-grow-1">
              <div className="container-fluid main-content">
                <div className="row">
                  <div className="col-12">
                    <div className="card border-0 shadow-sm w-100">
                      <div className="card-header bg-white">
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="mb-0">
                            <FontAwesomeIcon icon={faUsers} className="me-20" />
                            Lista de Estudantes
                          </h5>
                          <div className="d-flex gap-2">
                            <div className="input-group" style={{ width: "300px" }}>
                              <span className="input-group-text">
                                <FontAwesomeIcon icon={faSearch} />
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Pesquisar estudantes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                            </div>
                            <select
                              className="form-select"
                              style={{ width: "200px" }}
                              value={filterStatus}
                              onChange={(e) => setFilterStatus(e.target.value)}
                            >
                              <option value="todos">Todos</option>
                              <option value="ativos">Ativos</option>
                              <option value="inativos">Inativos</option>
                              <option value="pedidos-remocao">Pedidos de Remoção</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        {filteredEstudantes.length === 0 ? (
                          <p className="text-muted text-center">Nenhum estudante encontrado.</p>
                        ) : (
                          <div className="table">
                            <table className="table table-hover">
                              <thead>
                                <tr>
                                  <th>Nome</th>
                                  <th>Email</th>
                                  <th>Curso</th>
                                  <th>Ano</th>
                                  <th>Status</th>
                                  <th>Ações</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredEstudantes.map((estudante) => (
                                  <tr key={estudante.iduser}>
                                    <td>{estudante.nome}</td>
                                    <td>{estudante.email}</td>
                                    <td>{estudante.curso || 'N/A'}</td>
                                    <td>{estudante.ano || 'N/A'}</td>
                                    <td>{getStatusBadge(estudante)}</td>
                                    <td>
                                      <div className="btn-group" role="group">
                                        <button
                                          className="btn btn-sm btn-outline-primary"
                                          onClick={() => handleViewDetails(estudante)}
                                          title="Ver detalhes"
                                        >
                                          <FontAwesomeIcon icon={faEye} />
                                        </button>
                                        {/* Temporário: botões de remoção desabilitados */}
                                        <button
                                          className="btn btn-sm btn-outline-secondary"
                                          disabled
                                          title="Funcionalidade temporariamente indisponível"
                                        >
                                          <FontAwesomeIcon icon={faCheck} />
                                        </button>
                                        <button
                                          className="btn btn-sm btn-outline-secondary"
                                          disabled
                                          title="Funcionalidade temporariamente indisponível"
                                        >
                                          <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {showModal && selectedEstudante && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalhes do Estudante</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Informações Pessoais</h6>
                    <p><strong>Nome:</strong> {selectedEstudante.nome}</p>
                    <p><strong>Email:</strong> {selectedEstudante.email}</p>
                    <p><strong>Telefone:</strong> {selectedEstudante.telefone || 'N/A'}</p>
                    <p><strong>Idade:</strong> {selectedEstudante.idade || 'N/A'}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Informações Académicas</h6>
                    <p><strong>Curso:</strong> {selectedEstudante.curso || 'N/A'}</p>
                    <p><strong>Ano:</strong> {selectedEstudante.ano || 'N/A'}</p>
                    <p><strong>Interesses:</strong> {selectedEstudante.interesses || 'N/A'}</p>
                    <p><strong>Competências:</strong> {selectedEstudante.competencias || 'N/A'}</p>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <h6>Status da Conta</h6>
                    <p><strong>Status:</strong> {getStatusBadge(selectedEstudante)}</p>
                    {selectedEstudante.data_remocao && (
                      <p><strong>Data de Remoção:</strong> {new Date(selectedEstudante.data_remocao).toLocaleDateString('pt-PT')}</p>
                    )}
                    {selectedEstudante.data_criacao && (
                      <p><strong>Data de Criação:</strong> {new Date(selectedEstudante.data_criacao).toLocaleDateString('pt-PT')}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default EstudantesGestor;
