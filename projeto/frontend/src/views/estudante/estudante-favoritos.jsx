import "../../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCalendar, faMapMarker } from "@fortawesome/free-solid-svg-icons";

import SideBar from "../../components/sidebarestudante";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Logo from "../../imgs/logo1.png";

function EstudanteFavoritos() {
  const [version, setVersion] = useState(0);

  const favoritos = useMemo(() => {
    try {
      const iduser = localStorage.getItem("iduser") || "anon";
      const raw = localStorage.getItem(`favoritos_${iduser}`);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }, [version]);

  const removeFavorito = (idproposta) => {
    const iduser = localStorage.getItem("iduser") || "anon";
    try {
      const raw = localStorage.getItem(`favoritos_${iduser}`);
      const list = raw ? JSON.parse(raw) : [];
      const next = list.filter((f) => String(f.idproposta) !== String(idproposta));
      localStorage.setItem(`favoritos_${iduser}`, JSON.stringify(next));
      setVersion((v) => v + 1);
    } catch (e) {
      // ignore
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
            <Navbar title={"Favoritos"} />
            <div className="d-flex flex-grow-1">
              <div className="container-fluid main-content d-flex align-items-start justify-content-center py-4">
                <div className="w-100" style={{ maxWidth: 1000 }}>
                  {favoritos.length === 0 ? (
                    <div className="alert alert-info">Sem favoritos ainda.</div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {favoritos.map((p) => (
                        <div className="card p-3" key={p.idproposta}>
                          <div className="row align-items-center">
                            <div className="col-md-2 col-sm-3 text-center">
                              <img src={p.imagem || Logo} alt="logo" className="w-100" />
                            </div>
                            <div className="col-md-8 col-sm-6">
                              <h5 className="mb-2">{p.nome || "Empresa"}</h5>
                              <div className="d-flex flex-wrap gap-4 text-muted">
                                <span><FontAwesomeIcon icon={faCalendar} className="me-2" />{p.data_submissao || ""}</span>
                                <span><FontAwesomeIcon icon={faMapMarker} className="me-2" />{p.localizacao || ""}</span>
                              </div>
                              <div className="mt-2">
                                <b className="tag-label rounded px-2 text-white">Área de trabalho</b>
                                <br />
                                <span>{p.categoria || ""}</span>
                              </div>
                              <div className="mt-2">
                                <b className="tag-label rounded px-2 text-white">Ocupação</b>
                                <br />
                                <span>{p.vaga || ""}</span>
                              </div>
                            </div>
                            <div className="col-md-2 col-sm-3 d-flex justify-content-md-end justify-content-start mt-sm-3 mt-md-0">
                              <button className="btn btn-outline-danger" onClick={() => removeFavorito(p.idproposta)}>
                                <FontAwesomeIcon icon={faTrash} className="me-2" /> Remover
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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

export default EstudanteFavoritos;

