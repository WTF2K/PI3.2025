import "../../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
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
  faPencilSquare,
  faTrashCan,
  faGraduationCap,
  faUserCheck,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { faMapMarker, faAt, faPhone } from "@fortawesome/free-solid-svg-icons";

import Logo from "../../imgs/logo1.png";

function EstudantesInativosAdmin() {
  const topRef = useRef(null);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [estudantes, setEstudantes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const fetchEstudantesInativos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/utilizadores/estudantes/inativos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEstudantes(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao buscar estudantes inativos:", err);
      setErro("Erro ao carregar estudantes inativos.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstudantesInativos();
  }, []);

  // Filtra estudantes por nome
  const filteredEstudantes = estudantes.filter(
    (u) => u.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para reativar conta
  const handleReativar = async (id) => {
    if (window.confirm("Tem a certeza que deseja reativar esta conta de estudante?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.put(`http://localhost:3000/api/utilizadores/${id}/ativar`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Atualizar lista
        await fetchEstudantesInativos();
        setSelectedDetails(null);
        alert("Conta reativada com sucesso!");
      } catch (err) {
        console.error("Erro ao reativar conta:", err);
        alert("Erro ao reativar conta. Tente novamente.");
      }
    }
  };

  // Função para eliminar permanentemente
  const handleDelete = (id) => {
    if (window.confirm("ATENÇÃO: Tem a certeza que deseja eliminar PERMANENTEMENTE este estudante? Esta ação não pode ser desfeita.")) {
      const token = localStorage.getItem("token");
      axios
        .delete(`http://localhost:3000/api/utilizadores/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setEstudantes(estudantes.filter((e) => e.iduser !== id));
          setSelectedDetails(null);
          alert("Estudante eliminado permanentemente.");
        })
        .catch((err) => {
          console.error("Erro ao eliminar estudante:", err);
          alert("Erro ao eliminar estudante.");
        });
    }
  };

  return (
    <div className="main-wrapper">
      <div className="d-flex flex-column">
        <div className="d-md-flex flex-row justify-content-between">
          <div className="col-md-3 col-sm-1">
            <SideBar />
          </div>
          <div className="col-md-9 col-sm-12">
            <Navbar title={"Ex-Estudantes (Contas Inativas)"} />
            <div className="d-flex flex-grow-1">
              <div className="container-fluid main-content d-flex justify-content-center">
                <div className="d-flex flex-column">
                  <div className="inicio-admin">
                    <div className="search-box my-4">
                      <div className="d-flex flex-row">
                        <div className="col-5">
                          <input
                            type="text"
                            placeholder="Pesquisar ex-estudantes..."
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

                    {selectedDetails && (
                      <div
                        className="card mb-4 p-3 w-100"
                        style={{ background: "#f8f9fa", border: "1px solid #314B66" }}
                        ref={topRef}
                      >
                        <div className="d-inline-flex justify-content-between">
                          <div className="d-flex justify-content-md-start gap-2 justify-content-center align-items-center fs-4">
                            <button
                              className="btn btn-link text-success p-0"
                              title="Reativar conta"
                              onClick={() => handleReativar(selectedDetails.iduser)}
                            >
                              <FontAwesomeIcon icon={faUserCheck} />
                            </button>
                            <Link
                              to={`/adm/estudantes/${selectedDetails.iduser}`}
                              className="text-warning"
                              title="Editar estudante"
                            >
                              <FontAwesomeIcon
                                className="me-2"
                                icon={faPencilSquare}
                              />
                            </Link>
                            <button
                              className="btn btn-link text-danger p-0"
                              title="Eliminar permanentemente"
                              onClick={() => handleDelete(selectedDetails.iduser)}
                            >
                              <FontAwesomeIcon icon={faTrashCan} />
                            </button>
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
                            <img src={Logo} alt="Logo" className="w-100" />
                          </div>
                          <div className="col-md-9 col-sm-12">
                            <h1 className="card-title fw-bolder" style={{ color: "#314B66" }}>
                              {selectedDetails.nome}
                              <span className="badge bg-danger ms-2">INATIVO</span>
                            </h1>
                            <div className="fs-5 d-md-flex flex-row align-items-center gap-4 flex-wrap">
                              <p>
                                <b className="me-2">
                                  <FontAwesomeIcon icon={faGraduationCap} />
                                </b>
                                {selectedDetails.ano}
                              </p>
                              <p>
                                <b className="me-2">
                                  <FontAwesomeIcon icon={faMapMarker} />
                                </b>
                                {selectedDetails.localizacao || "Portugal"}
                              </p>
                              <p>
                                <b className="me-2">
                                  <FontAwesomeIcon icon={faAt} />
                                </b>
                                {selectedDetails.email}
                              </p>
                              <p>
                                <b className="me-2">
                                  <FontAwesomeIcon icon={faPhone} />
                                </b>
                                {selectedDetails.telefone || "N/A"}
                              </p>
                            </div>
                            {selectedDetails.data_remocao && (
                              <div className="fs-5 d-md-flex flex-row align-items-center gap-4 flex-wrap">
                                <p>
                                  <b className="me-2">
                                    <FontAwesomeIcon icon={faCalendar} />
                                  </b>
                                  Removido em: {selectedDetails.data_remocao}
                                </p>
                              </div>
                            )}
                            <div className="fs-5 d-md-flex flex-row align-items-center gap-4 flex-wrap">
                              <p>
                                <b className="tag-label rounded px-2 text-white">
                                  Percurso Académico
                                </b>
                                <br />
                                {selectedDetails.percurso}
                              </p>
                            </div>
                            <p>
                              <b className="tag-label rounded px-2 text-white">
                                Área de Interesse Pessoal
                              </b>
                              <br />
                              {selectedDetails.interesses}
                            </p>
                            <p>
                              <b className="tag-label rounded px-2 text-white">
                                Competências & Soft Skills
                              </b>
                              <br />
                              {selectedDetails.competencias}
                            </p>
                            <p>
                              <b className="tag-label rounded px-2 text-white">
                                Curso
                              </b>
                              <br />
                              {selectedDetails.curso}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-3 cards-wrapper d-flex flex-wrap gap-3 justify-content-center">
                      {loading ? (
                        <p className="text-center w-100">A carregar ex-estudantes...</p>
                      ) : erro ? (
                        <p className="text-danger text-center w-100">{erro}</p>
                      ) : filteredEstudantes.length === 0 ? (
                        <p className="text-center w-100">Nenhum ex-estudante encontrado.</p>
                      ) : (
                        filteredEstudantes.map((data, index) => (
                          <div className="card-component w-100" key={index}>
                            <CardModal
                              imagem={Logo}
                              empresa={data.nome + " (INATIVO)"}
                              areaTrabalho={data.percurso}
                              ocupacao={data.curso}
                              isValidation={false}
                              labelEmpresa="Nome"
                              labelAreaTrabalho="Percurso Académico"
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

export default EstudantesInativosAdmin;