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
  faBuilding,
  faUserTie,
  faGraduationCap,
  faTasks,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

import React, { useEffect, useState } from "react";
import axios from "axios";

import SideBar from "../../components/sidebaradm";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

function DashboardAdmin() {
  const [stats, setStats] = useState({
    totalPropostas: 0,
    propostasPendentes: 0,
    propostasAprovadas: 0,
    propostasRejeitadas: 0,
    totalEstudantes: 0,
    estudantesAtivos: 0,
    estudantesInativos: 0,
    estudantesPendentesRemocao: 0,
    totalEmpresas: 0,
    totalGestores: 0,
    totalUtilizadores: 0,
  });

  const [recentPropostas, setRecentPropostas] = useState([]);
  const [pedidosRemocao, setPedidosRemocao] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchPedidosRemocao();
    fetchRecentUsers();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      // Buscar todas as propostas
      const propostasResponse = await axios.get(
        "http://localhost:3000/api/propostas",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Buscar todos os utilizadores
      const utilizadoresResponse = await axios.get(
        "http://localhost:3000/api/utilizadores",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Buscar estudantes específicos
      const estudantesResponse = await axios.get(
        "http://localhost:3000/api/utilizadores/estudantes",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Buscar estudantes inativos
      const estudantesInativosResponse = await axios.get(
        "http://localhost:3000/api/utilizadores/estudantes/inativos",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const propostas = propostasResponse.data;
      const utilizadores = utilizadoresResponse.data;
      const estudantes = estudantesResponse.data;
      const estudantesInativos = estudantesInativosResponse.data;

      // Calcular estatísticas das propostas
      const totalPropostas = propostas.length;
      const propostasPendentes = propostas.filter(
        (p) => p.data_validacao === null || p.data_validacao === undefined
      ).length;
      const propostasAprovadas = propostas.filter((p) => p.validada === true).length;
      const propostasRejeitadas = propostas.filter(
        (p) => p.validada === false && p.data_validacao
      ).length;

      // Calcular estatísticas dos utilizadores
      const totalEstudantes = estudantes.length;
      const estudantesAtivos = estudantes.filter((e) => e.ativo !== false).length;
      const estudantesPendentesRemocao = estudantes.filter(
        (e) => e.pedido_remocao === true
      ).length;

      // Contar por tipo de utilizador
      const totalEmpresas = utilizadores.filter((u) => u.idtuser === 3).length;
      const totalGestores = utilizadores.filter((u) => u.idtuser === 2).length;
      const totalUtilizadores = utilizadores.length;

      setStats({
        totalPropostas,
        propostasPendentes,
        propostasAprovadas,
        propostasRejeitadas,
        totalEstudantes,
        estudantesAtivos,
        estudantesInativos: estudantesInativos.length,
        estudantesPendentesRemocao,
        totalEmpresas,
        totalGestores,
        totalUtilizadores,
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

  const fetchRecentUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:3000/api/utilizadores",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Últimos 5 utilizadores criados (assumindo que têm um campo de data ou ID crescente)
      const recent = res.data
        .sort((a, b) => b.iduser - a.iduser) // Ordenar por ID decrescente
        .slice(0, 5);
      setRecentUsers(recent);
    } catch (error) {
      console.error("Erro ao carregar utilizadores recentes:", error);
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
      await fetchDashboardData();
      alert("Conta do estudante desativada com sucesso!");
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
      await fetchDashboardData();
      alert("Pedido de remoção rejeitado!");
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

  const getTipoUtilizador = (idtuser) => {
    switch (idtuser) {
      case 1:
        return { nome: "Admin", cor: "danger" };
      case 2:
        return { nome: "Gestor", cor: "primary" };
      case 3:
        return { nome: "Empresa", cor: "info" };
      case 4:
        return { nome: "Estudante", cor: "success" };
      default:
        return { nome: "Desconhecido", cor: "secondary" };
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
            <Navbar title={"Dashboard Administrativo"} />
            <div className="d-flex flex-grow-1">
              <div className="container-fluid main-content">
                <div className="row">
                  {/* Cards de Estatísticas Gerais */}
                  <div className="col-12 mb-4">
                   
                    <div className="row">
                      {/* Total Utilizadores */}
                      <div className="col-md-3 col-sm-6 mb-3">
                        <div className="card border-0 shadow-sm">
                          <div className="card-body text-center p-3">
                            <FontAwesomeIcon
                              icon={faUsers}
                              className="text-primary mb-2"
                              style={{ fontSize: "2rem" }}
                            />
                            <h6 className="card-title mb-1">Total Utilizadores</h6>
                            <h4 className="text-primary mb-0">
                              {stats.totalUtilizadores}
                            </h4>
                          </div>
                        </div>
                      </div>

                      {/* Total Propostas */}
                      <div className="col-md-3 col-sm-6 mb-3">
                        <div className="card border-0 shadow-sm">
                          <div className="card-body text-center p-3">
                            <FontAwesomeIcon
                              icon={faFileAlt}
                              className="text-info mb-2"
                              style={{ fontSize: "2rem" }}
                            />
                            <h6 className="card-title mb-1">Total Propostas</h6>
                            <h4 className="text-info mb-0">
                              {stats.totalPropostas}
                            </h4>
                          </div>
                        </div>
                      </div>

                      {/* Propostas Pendentes */}
                      <div className="col-md-3 col-sm-6 mb-3">
                        <div className="card border-0 shadow-sm">
                          <div className="card-body text-center p-3">
                            <FontAwesomeIcon
                              icon={faClock}
                              className="text-warning mb-2"
                              style={{ fontSize: "2rem" }}
                            />
                            <h6 className="card-title mb-1">Pendentes Validação</h6>
                            <h4 className="text-warning mb-0">
                              {stats.propostasPendentes}
                            </h4>
                          </div>
                        </div>
                      </div>

                      {/* Pedidos Remoção */}
                      <div className="col-md-3 col-sm-6 mb-3">
                        <div className="card border-0 shadow-sm">
                          <div className="card-body text-center p-3">
                            <FontAwesomeIcon
                              icon={faExclamationTriangle}
                              className="text-danger mb-2"
                              style={{ fontSize: "2rem" }}
                            />
                            <h6 className="card-title mb-1">Pedidos Remoção</h6>
                            <h4 className="text-danger mb-0">
                              {stats.estudantesPendentesRemocao}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estatísticas por Tipo de Utilizador */}
                  <div className="col-12 mb-4">
                    
                    <div className="row">
                      {/* Estudantes */}
                      <div className="col-md-3 col-sm-6 mb-3">
                        <div className="card border-0 shadow-sm">
                          <div className="card-body text-center p-3">
                            <FontAwesomeIcon
                              icon={faGraduationCap}
                              className="text-success mb-2"
                              style={{ fontSize: "1.5rem" }}
                            />
                            <h6 className="card-title mb-1">Estudantes</h6>
                            <h5 className="text-success mb-0">
                              {stats.totalEstudantes}
                            </h5>
                            <small className="text-muted">
                              {stats.estudantesAtivos} ativos
                            </small>
                          </div>
                        </div>
                      </div>

                      {/* Empresas */}
                      <div className="col-md-3 col-sm-6 mb-3">
                        <div className="card border-0 shadow-sm">
                          <div className="card-body text-center p-3">
                            <FontAwesomeIcon
                              icon={faBuilding}
                              className="text-info mb-2"
                              style={{ fontSize: "1.5rem" }}
                            />
                            <h6 className="card-title mb-1">Empresas</h6>
                            <h5 className="text-info mb-0">
                              {stats.totalEmpresas}
                            </h5>
                          </div>
                        </div>
                      </div>

                      {/* Gestores */}
                      <div className="col-md-3 col-sm-6 mb-3">
                        <div className="card border-0 shadow-sm">
                          <div className="card-body text-center p-3">
                            <FontAwesomeIcon
                              icon={faUserTie}
                              className="text-primary mb-2"
                              style={{ fontSize: "1.5rem" }}
                            />
                            <h6 className="card-title mb-1">Gestores</h6>
                            <h5 className="text-primary mb-0">
                              {stats.totalGestores}
                            </h5>
                          </div>
                        </div>
                      </div>

                      {/* Ex-Estudantes */}
                      <div className="col-md-3 col-sm-6 mb-3">
                        <div className="card border-0 shadow-sm">
                          <div className="card-body text-center p-3">
                            <FontAwesomeIcon
                              icon={faUserSlash}
                              className="text-secondary mb-2"
                              style={{ fontSize: "1.5rem" }}
                            />
                            <h6 className="card-title mb-1">Ex-Estudantes</h6>
                            <h5 className="text-secondary mb-0">
                              {stats.estudantesInativos}
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pedidos de Remoção */}
                  {pedidosRemocao.length > 0 && (
                    <div className="col-12 mb-4">
                      <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white d-flex align-items-center justify-content-between">
                          <h5 className="mb-0">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2 text-warning" />
                            Pedidos de Remoção Pendentes
                          </h5>
                          <span className="badge bg-warning text-dark">{pedidosRemocao.length}</span>
                        </div>
                        <div className="card-body">
                          <div className="table-responsive">
                            <table className="table table-hover">
                              <thead>
                                <tr>
                                  <th>ID</th>
                                  <th>Nome</th>
                                  <th>Email</th>
                                  <th>Curso</th>
                                  <th>Ações</th>
                                </tr>
                              </thead>
                              <tbody>
                                {pedidosRemocao.map((est) => (
                                  <tr key={est.iduser}>
                                    <td>#{est.iduser}</td>
                                    <td>{est.nome}</td>
                                    <td>{est.email}</td>
                                    <td>{est.curso || "N/A"}</td>
                                    <td>
                                      <button
                                        className="btn btn-sm btn-danger me-2"
                                        title="Aprovar e desativar conta"
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
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Duas colunas para tabelas */}
                  <div className="col-md-6 mb-4">
                    {/* Propostas Recentes */}
                    <div className="card border-0 shadow-sm h-100 w-100">
                      <div className="card-header bg-white">
                        <h5 className="mb-0">
                          <FontAwesomeIcon icon={faChartLine} className="me-2" />
                          Propostas Recentes
                        </h5>
                      </div>
                      <div className="card-body">
                        {recentPropostas.length === 0 ? (
                          <p className="text-muted text-center">
                            Nenhuma proposta encontrada.
                          </p>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-sm">
                              <thead>
                                <tr>
                                  <th>Título</th>
                                  <th>Status</th>
                                  <th>Data</th>
                                </tr>
                              </thead>
                              <tbody>
                                {recentPropostas.map((proposta) => (
                                  <tr key={proposta.idproposta}>
                                    <td>
                                      <div className="text-truncate" style={{ maxWidth: "200px" }}>
                                        {proposta.nome}
                                      </div>
                                      <small className="text-muted">
                                        {proposta.categoria}
                                      </small>
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
                                    <td>
                                      <small>
                                        {proposta.data_submissao
                                          ? new Date(proposta.data_submissao).toLocaleDateString("pt-PT")
                                          : "N/A"}
                                      </small>
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

                  <div className="col-md-6 mb-4">
                    {/* Utilizadores Recentes */}
                    <div className="card border-0 shadow-sm h-100 w-100">
                      <div className="card-header bg-white">
                        <h5 className="mb-0">
                          <FontAwesomeIcon icon={faUsers} className="me-2" />
                          Utilizadores Recentes
                        </h5>
                      </div>
                      <div className="card-body">
                        {recentUsers.length === 0 ? (
                          <p className="text-muted text-center">
                            Nenhum utilizador encontrado.
                          </p>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-sm">
                              <thead>
                                <tr>
                                  <th>Nome</th>
                                  <th>Tipo</th>
                                  <th>Email</th>
                                </tr>
                              </thead>
                              <tbody>
                                {recentUsers.map((user) => {
                                  const tipo = getTipoUtilizador(user.idtuser);
                                  return (
                                    <tr key={user.iduser}>
                                      <td>
                                        <div className="text-truncate" style={{ maxWidth: "150px" }}>
                                          {user.nome}
                                        </div>
                                      </td>
                                      <td>
                                        <span className={`badge bg-${tipo.cor}`}>
                                          {tipo.nome}
                                        </span>
                                      </td>
                                      <td>
                                        <small className="text-muted">
                                          {user.email}
                                        </small>
                                      </td>
                                    </tr>
                                  );
                                })}
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

export default DashboardAdmin;