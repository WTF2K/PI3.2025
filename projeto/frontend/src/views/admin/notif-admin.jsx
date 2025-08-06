import "../../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

import SideBar from "../../components/sidebaradm";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Logo from "../../imgs/logo1.png";

function InicioAdmin() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar notificações da API
  const fetchNotificacoes = () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/api/notificacoes/", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setNotificacoes(res.data);
        } else if (Array.isArray(res.data.data)) {
          setNotificacoes(res.data.data);
        } else {
          console.error("Formato inesperado da resposta:", res.data);
          setNotificacoes([]);
        }
      })
      .catch((error) => {
        console.error("Erro ao obter notificações:", error);
        setNotificacoes([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotificacoes();
  }, []);

  // Função para apagar notificação
  const handleDelete = (idnotas) => {
    if (window.confirm("Tem certeza que quer apagar esta notificação?")) {
      axios
        .delete(`http://localhost:3000/api/notificacoes/${idnotas}`)
        .then(() => {
          // Atualizar lista depois de apagar
          setNotificacoes((prev) =>
            prev.filter((noti) => noti.idnotas !== idnotas)
          );
        })
        .catch((err) => {
          alert("Erro ao apagar notificação: " + err.message);
        });
    }
  };

  // Função para marcar notificação como lida
  const handleMarkAsRead = (idnotas) => {
    axios
      .put(`http://localhost:3000/api/notificacoes/${idnotas}`, { lida: "Sim" })
      .then(() => {
        setNotificacoes((prev) =>
          prev.map((noti) =>
            noti.idnotas === idnotas ? { ...noti, lida: "Sim" } : noti
          )
        );
      })
      .catch((err) => {
        alert("Erro ao marcar como lida: " + err.message);
      });
  };

  return (
    <div className="main-wrapper bg-light" style={{ minHeight: "100vh" }}>
      <div className="d-flex flex-column">
        <div className="d-md-flex flex-row justify-content-between">
          <div className="col-md-3 col-sm-1">
            <SideBar />
          </div>
          <div className="col-md-9 col-sm-12">
            <Navbar title={"Notificações"} />
            <div className="container-fluid main-content p-4">
              {loading ? (
                <p>Carregando notificações...</p>
              ) : notificacoes.length > 0 ? (
                <div className="row g-3">
                  {notificacoes.map((noti) => (
                    <div className="col-md-6 col-lg-4" key={noti.idnotas}>
                      <div
                        className={`card shadow-sm ${
                          noti.lida === "Sim" ? "border-success" : ""
                        }`}
                      >
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title">
                            {noti.lida === "Sim" ? (
                              <FontAwesomeIcon
                                icon={faCheckCircle}
                                className="text-success me-2"
                                title="Lida"
                              />
                            ) : (
                              <span className="badge bg-warning text-dark me-2">
                                Nova
                              </span>
                            )}
                            Notificação #{noti.idnotas}
                          </h5>
                          <p className="card-text flex-grow-1">{noti.mensagem}</p>
                          <small className="text-muted mb-2">
                            Enviada em:{" "}
                            {new Date(noti.data_envio).toLocaleDateString()}
                          </small>
                          <div className="d-flex justify-content-end gap-2">
                            {noti.lida !== "Sim" && (
                              <button
                                className="btn btn-sm btn-outline-success"
                                onClick={() => handleMarkAsRead(noti.idnotas)}
                              >
                                Marcar como lida
                              </button>
                            )}
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(noti.idnotas)}
                              title="Apagar notificação"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Sem notificações para mostrar.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default InicioAdmin;
