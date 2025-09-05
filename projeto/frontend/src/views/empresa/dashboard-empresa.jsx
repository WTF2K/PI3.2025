import "../../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

import SideBar from "../../components/sidebarempresa";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faUserGraduate,
  faChartLine,
  faPlus,
  faEye,
  faPencilSquare,
} from "@fortawesome/free-solid-svg-icons";

function DashboardEmpresa() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    ativas: 0,
    inativas: 0,
    atribuidas: 0,
    pendentes: 0
  });
  const [recentPropostas, setRecentPropostas] = useState([]);
  const [loading, setLoading] = useState(true);

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

    const fetchDashboardData = async () => {
      try {
        // Buscar todas as propostas da empresa
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/api/propostas/empresa/${userData.idempresa}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const propostas = response.data;

        // Calcular estatísticas
        const total = propostas.length;
        const ativas = propostas.filter(p => p.ativa && !p.atribuida_estudante).length;
        const inativas = propostas.filter(p => !p.ativa && !p.atribuida_estudante).length;
        const atribuidas = propostas.filter(p => p.atribuida_estudante).length;
        const pendentes = propostas.filter(p => !p.validada).length;

        setStats({
          total,
          ativas,
          inativas,
          atribuidas,
          pendentes
        });

        // Buscar propostas recentes (últimas 5)
        const recentes = propostas
          .sort((a, b) => new Date(b.data_submissao) - new Date(a.data_submissao))
          .slice(0, 5);

        setRecentPropostas(recentes);
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userData]);

  if (!userData) return null;

  if (loading) {
    return <div className="text-center mt-5">Carregando dashboard...</div>;
  }

  return (
    <div className="main-wrapper">
      <div className="d-flex flex-column">
        <div className="d-md-flex flex-row justify-content-between">
          <div className="col-md-3 col-sm-1">
            <SideBar />
          </div>
          <div className="col-md-9 col-sm-12">
            <Navbar title={"Dashboard"} />
            <div className="d-flex flex-grow-1">
              <div className="container-fluid main-content">
                <div className="inicio-admin">
                 {/* Cards de estatísticas */}
<div className="row mb-4 mt-4">
  <div className="col-md-4 col-sm-6 mb-3">
    <div
      className="card text-center h-100"
      style={{ background: "#f8f9fa" }}
    >
      <div className="card-body">
        <FontAwesomeIcon
          icon={faBriefcase}
          size="2x"
          className="text-primary mb-2"
        />
        <h5 className="card-title">{stats.total}</h5>
        <p className="card-text">Total de Propostas</p>
      </div>
    </div>
  </div>

  <div className="col-md-4 col-sm-6 mb-3">
    <div
      className="card text-center h-100"
      style={{ background: "#f8f9fa" }}
    >
      <div className="card-body">
        <FontAwesomeIcon
          icon={faCheckCircle}
          size="2x"
          className="text-success mb-2"
        />
        <h5 className="card-title">{stats.ativas}</h5>
        <p className="card-text">Propostas Ativas</p>
      </div>
    </div>
  </div>

  <div className="col-md-4 col-sm-6 mb-3">
    <div
      className="card text-center h-100"
      style={{ background: "#f8f9fa" }}
    >
      <div className="card-body">
        <FontAwesomeIcon
          icon={faTimesCircle}
          size="2x"
          className="text-warning mb-2"
        />
        <h5 className="card-title">{stats.inativas}</h5>
        <p className="card-text">Propostas Inativas</p>
      </div>
    </div>
  </div>

  {/* Linha seguinte */}
  <div className="col-md-4 col-sm-6 mb-3">
    <div
      className="card text-center h-100"
      style={{ background: "#f8f9fa" }}
    >
      <div className="card-body">
        <FontAwesomeIcon
          icon={faUserGraduate}
          size="2x"
          className="text-info mb-2"
        />
        <h5 className="card-title">{stats.atribuidas}</h5>
        <p className="card-text">Atribuídas</p>
      </div>
    </div>
  </div>

  <div className="col-md-4 col-sm-6 mb-3">
    <div
      className="card text-center h-100"
      style={{ background: "#f8f9fa" }}
    >
      <div className="card-body">
        <FontAwesomeIcon
          icon={faClock}
          size="2x"
          className="text-secondary mb-2"
        />
        <h5 className="card-title">{stats.pendentes}</h5>
        <p className="card-text">Pendentes</p>
      </div>
    </div>
  </div>

  <div className="col-md-4 col-sm-6 mb-3">
    <div
      className="card text-center h-100"
      style={{ background: "#f8f9fa" }}
    >
      <div className="card-body">
        <FontAwesomeIcon
          icon={faChartLine}
          size="2x"
          className="text-primary mb-2"
        />
        <h5 className="card-title">
          {stats.total > 0
            ? Math.round((stats.atribuidas / stats.total) * 100)
            : 0}
          %
        </h5>
        <p className="card-text">Taxa de Sucesso</p>
      </div>
    </div>
  </div>
</div>


                  {/* Ações rápidas */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <div className="card w-100" style={{ background: "#f8f9fa", border: "1px solid #314B66" }}>
                        <div className="card-header">
                          <h5 className="mb-0">Ações Rápidas</h5>
                        </div>
                        <div className="card-body">
                          <div className="d-flex flex-wrap gap-2">
                            <Link to="/empresa/propostas/add" className="btn btn-primary">
                              <FontAwesomeIcon icon={faPlus} className="me-2" />
                              Nova Proposta
                            </Link>
                            <Link to="/empresa/propostas" className="btn btn-outline-primary">
                              <FontAwesomeIcon icon={faEye} className="me-2" />
                              Ver Todas as Propostas
                            </Link>
                            <Link to="/empresa/propostas?filter=ativas" className="btn btn-outline-success">
                              <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                              Propostas Ativas
                            </Link>
                            <Link to="/empresa/propostas?filter=atribuidas" className="btn btn-outline-info">
                              <FontAwesomeIcon icon={faUserGraduate} className="me-2" />
                              Propostas Atribuídas
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Propostas recentes */}
                  <div className="row">
                    <div className="col-12">
                      <div className="card w-100" style={{ background: "#f8f9fa", border: "1px solid #314B66" }}>
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <h5 className="mb-0">Propostas Recentes</h5>
                          <Link to="/empresa/propostas" className="btn btn-sm btn-outline-primary">
                            Ver Todas
                          </Link>
                        </div>
                        <div className="card-body">
                          {recentPropostas.length === 0 ? (
                            <p className="text-center text-muted">Nenhuma proposta encontrada.</p>
                          ) : (
                            <div className="table-responsive">
                              <table className="table table-hover">
                                <thead>
                                  <tr>
                                    <th>Título</th>
                                    <th>Categoria</th>
                                    <th>Data</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {recentPropostas.map((proposta, index) => (
                                    <tr key={index}>
                                      <td>{proposta.nome}</td>
                                      <td>{proposta.categoria}</td>
                                      <td>{proposta.data_submissao ? new Date(proposta.data_submissao).toLocaleDateString() : 'N/A'}</td>
                                      <td>
                                        {proposta.atribuida_estudante ? (
                                          <span className="badge bg-info">Atribuída</span>
                                        ) : proposta.ativa ? (
                                          <span className="badge bg-success">Ativa</span>
                                        ) : (
                                          <span className="badge bg-warning">Inativa</span>
                                        )}
                                      </td>
                                      <td>
                                        <Link 
                                          to={`/empresas/propostas/${proposta.idproposta}`}
                                          className="btn btn-sm btn-outline-primary me-1"
                                        >
                                          <FontAwesomeIcon icon={faEye} />
                                        </Link>
                                        <Link 
                                          to={`/empresas/propostas/${proposta.idproposta}/edit`}
                                          className="btn btn-sm btn-outline-warning"
                                        >
                                          <FontAwesomeIcon icon={faPencilSquare} />
                                        </Link>
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
      </div>
      <Footer />
    </div>
  );
}

export default DashboardEmpresa;
