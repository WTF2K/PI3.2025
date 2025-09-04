import "../../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faUsers,
  faCheckCircle,
  faClock,
  faTimesCircle,
  faChartLine,
  faCalendarAlt,
  faMapMarkerAlt,
  faUserSlash,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";

import React, { useEffect, useState } from "react";
import axios from "axios";

import SideBar from "../../components/sidebargestor";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

function Dashboard2Gestor() {
  const [stats, setStats] = useState({
    totalPropostas: 0,
    propostasPendentes: 0,
    propostasAprovadas: 0,
    propostasRejeitadas: 0,
    totalEstudantes: 0,
    estudantesAtivos: 0,
    estudantesPendentesRemocao: 0,
  });

  const [recentPropostas, setRecentPropostas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pedidosRemocao, setPedidosRemocao] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchPedidosRemocao();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      // Buscar propostas
      const propostasResponse = await axios.get(
        "http://localhost:3000/api/propostas",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Buscar estudantes
      const estudantesResponse = await axios.get(
        "http://localhost:3000/api/utilizadores/estudantes",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const propostas = propostasResponse.data;
      const estudantes = estudantesResponse.data;

      // Calcular estatísticas reais
      const totalPropostas = propostas.length;
      const propostasPendentes = propostas.filter(
        (p) => p.data_validacao === null || p.data_validacao === undefined
      ).length;
      const propostasAprovadas = propostas.filter((p) => p.validada === true)
        .length;
      const propostasRejeitadas = propostas.filter(
        (p) => p.validada === false && p.data_validacao
      ).length;

      const totalEstudantes = estudantes.length;
      const estudantesAtivos = estudantes.filter((e) => e.ativo !== false).length;
      const estudantesPendentesRemocao = estudantes.filter(
        (e) => e.pedido_remocao === true
      ).length;

      setStats({
        totalPropostas,
        propostasPendentes,
        propostasAprovadas,
        propostasRejeitadas,
        totalEstudantes,
        estudantesAtivos,
        estudantesPendentesRemocao,
      });

      // Propostas recentes (últimas 5)
      const recentes = propostas
        .sort((a, b) => new Date(b.data_submissao) - new Date(a.data_submissao))
        .slice(0, 5);
      setRecentPropostas(recentes);

      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
      setLoading(false);
    }
  };

  const fetchPedidosRemocao = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:3000/api/utilizadores/estudantes/pedidos-remocao",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPedidosRemocao(res.data || []);
    } catch (error) {
      console.error("Erro ao carregar pedidos de remoção:", error);
    }
  };

  const aprovarRemocao = async (iduser) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/utilizadores/${iduser}/aprovar-remocao`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchPedidosRemocao();
      // Atualiza cards
      await fetchDashboardData();
      alert("Conta do estudante desativada.");
    } catch (err) {
      alert("Erro ao aprovar remoção: " + (err.response?.data?.error || err.message));
    }
  };

  const rejeitarRemocao = async (iduser) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/utilizadores/${iduser}/rejeitar-remocao`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchPedidosRemocao();
      // Atualiza cards
      await fetchDashboardData();
      alert("Pedido rejeitado.");
    } catch (err) {
      alert("Erro ao rejeitar pedido: " + (err.response?.data?.error || err.message));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case true:
        return "success";
      case false:
        return "danger";
      default:
        return "warning";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case true:
        return "Aprovada";
      case false:
        return "Rejeitada";
      default:
        return "Pendente";
    }
  };

  if (loading) {
    return (
      <div className="main-wrapper">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
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
          <div className="col-md-9 col-sm-12">
            <Navbar title={"Estatísticas"} />
            <div className="d-flex flex-grow-1">
              <div className="container-fluid main-content">
                <div className="row">
                  {/* Cards de Estatísticas */}
                  <div className="col-12 mb-4">
                    <div className="row">
                      {/* Total Propostas */}
                      <div className="col-md-3 col-sm-6 mb-3">
                        <div className="card border-0">
                          <div className="card-body text-center p-2">
                            <FontAwesomeIcon
                              icon={faFileAlt}
                              className="text-primary mb-1"
                              style={{ fontSize: "1.5rem" }}
                            />
                            <h6 className="card-title mb-1">Total Propostas</h6>
                            <h5 className="text-primary mb-0">
                              {stats.totalPropostas}
                            </h5>
                          </div>
                        </div>
                      </div>

                      {/* Pendentes */}
                      <div className="col-md-3 col-sm-6 mb-3">
                        <div className="card border-0">
                          <div className="card-body text-center p-2">
                            <FontAwesomeIcon
                              icon={faClock}
                              className="text-warning mb-1"
                              style={{ fontSize: "1.5rem" }}
                            />
                            <h6 className="card-title mb-1">Pendentes</h6>
                            <h5 className="text-warning mb-0">
                              {stats.propostasPendentes}
                            </h5>
                          </div>
                        </div>
                      </div>

                      {/* Aprovadas */}
                      <div className="col-md-3 col-sm-6 mb-3">
                        <div className="card border-0">
                          <div className="card-body text-center p-2">
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              className="text-success mb-1"
                              style={{ fontSize: "1.5rem" }}
                            />
                            <h6 className="card-title mb-1">Aprovadas</h6>
                            <h5 className="text-success mb-0">
                              {stats.propostasAprovadas}
                            </h5>
                          </div>
                        </div>
                      </div>

                      {/* Rejeitadas */}
                      <div className="col-md-3 col-sm-6 mb-3">
                        <div className="card border-0">
                          <div className="card-body text-center p-2">
                            <FontAwesomeIcon
                              icon={faTimesCircle}
                              className="text-danger mb-1"
                              style={{ fontSize: "1.5rem" }}
                            />
                            <h6 className="card-title mb-1">Rejeitadas</h6>
                            <h5 className="text-danger mb-0">
                              {stats.propostasRejeitadas}
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estatísticas de Estudantes */}
                  <div className="col-12 mb-4">
                    <div className="row">
                      {/* Total Estudantes */}
                      <div className="col-md-4 col-sm-6 mb-3">
                        <div className="card border-0">
                          <div className="card-body text-center p-2">
                            <FontAwesomeIcon
                              icon={faUsers}
                              className="text-info mb-1"
                              style={{ fontSize: "1.5rem" }}
                            />
                            <h6 className="card-title mb-1">
                              Total Estudantes
                            </h6>
                            <h5 className="text-info mb-0">
                              {stats.totalEstudantes}
                            </h5>
                          </div>
                        </div>
                      </div>

                      {/* Estudantes Ativos */}
                      <div className="col-md-4 col-sm-6 mb-3">
                        <div className="card border-0">
                          <div className="card-body text-center p-2">
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              className="text-success mb-1"
                              style={{ fontSize: "1.5rem" }}
                            />
                            <h6 className="card-title mb-1">
                              Estudantes Ativos
                            </h6>
                            <h5 className="text-success mb-0">
                              {stats.estudantesAtivos}
                            </h5>
                          </div>
                        </div>
                      </div>

                      {/* Pedidos de Remoção */}
                      <div className="col-md-4 col-sm-6 mb-3">
                        <div className="card border-0">
                          <div className="card-body text-center p-2">
                            <FontAwesomeIcon
                              icon={faTimesCircle}
                              className="text-warning mb-1"
                              style={{ fontSize: "1.5rem" }}
                            />
                            <h6 className="card-title mb-1">
                              Pedidos de Remoção
                            </h6>
                            <h5 className="text-warning mb-0">
                              {stats.estudantesPendentesRemocao}
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pedidos de Remoção de Estudantes */}
                  <div className="col-12 mb-4">
                    <div className="card border-0 shadow-sm w-100">
                      <div className="card-header bg-white d-flex align-items-center justify-content-between">
                        <h5 className="mb-0">Pedidos de Remoção</h5>
                        <span className="badge bg-secondary">{pedidosRemocao.length}</span>
                      </div>
                      <div className="card-body">
                        {pedidosRemocao.length === 0 ? (
                          <p className="text-muted mb-0">Sem pedidos pendentes.</p>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-hover">
                              <thead>
                                <tr>
                                  <th>ID</th>
                                  <th>Nome</th>
                                  <th>Email</th>
                                  <th>Ações</th>
                                </tr>
                              </thead>
                              <tbody>
                                {pedidosRemocao.map((est) => (
                                  <tr key={est.iduser}>
                                    <td>{est.iduser}</td>
                                    <td>{est.nome}</td>
                                    <td>{est.email}</td>
                                    <td>
                                      <button
                                        className="btn btn-sm btn-danger me-2"
                                        title="Desativar conta"
                                        onClick={() => aprovarRemocao(est.iduser)}
                                      >
                                        <FontAwesomeIcon icon={faUserSlash} />
                                      </button>
                                      <button
                                        className="btn btn-sm btn-success"
                                        title="Rejeitar pedido"
                                        onClick={() => rejeitarRemocao(est.iduser)}
                                      >
                                        <FontAwesomeIcon icon={faUserCheck} />
                                      </button>
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

                  {/* Propostas Recentes */}
                  <div className="col-12">
                    <div className="card border-0 shadow-sm w-100">
                      <div className="card-header bg-white">
                        <h5 className="mb-0">
                          <FontAwesomeIcon
                            icon={faChartLine}
                            className="me-2"
                          />
                          Propostas Recentes
                        </h5>
                      </div>
                      <div className="card-body">
                        {recentPropostas.length === 0 ? (
                          <p className="text-muted text-center">
                            Nenhuma proposta encontrada.
                          </p>
                        ) : (
                          <div className="table">
                            <table className="table table-hover">
                              <thead>
                                <tr>
                                  <th>Título</th>
                                  <th>Categoria</th>
                                  <th>Localização</th>
                                  <th>Data Submissão</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {recentPropostas.map((proposta) => (
                                  <tr key={proposta.idproposta}>
                                    <td>{proposta.nome}</td>
                                    <td>{proposta.categoria || "N/A"}</td>
                                    <td>
                                      <FontAwesomeIcon
                                        icon={faMapMarkerAlt}
                                        className="me-1 text-muted"
                                      />
                                      {proposta.localizacao || "N/A"}
                                    </td>
                                    <td>
                                      <FontAwesomeIcon
                                        icon={faCalendarAlt}
                                        className="me-1 text-muted"
                                      />
                                      {proposta.data_submissao
                                        ? new Date(
                                            proposta.data_submissao
                                          ).toLocaleDateString("pt-PT")
                                        : "N/A"}
                                    </td>
                                    <td>
                                      <span
                                        className={`badge bg-${getStatusColor(
                                          proposta.data_validacao
                                            ? proposta.validada
                                            : undefined
                                        )}`}
                                      >
                                        {getStatusText(
                                          proposta.data_validacao
                                            ? proposta.validada
                                            : undefined
                                        )}
                                      </span>
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
      <Footer />
    </div>
  );
}

export default Dashboard2Gestor;
