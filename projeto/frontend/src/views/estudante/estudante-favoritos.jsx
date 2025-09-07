import "../../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCalendar, faMapMarker } from "@fortawesome/free-solid-svg-icons";

import SideBar from "../../components/sidebarestudante";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Card from "../../components/card";
import Logo from "../../imgs/logo1.png";

function EstudanteFavoritos() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  function getFavoritesKey() {
    const userId = localStorage.getItem("iduser") || "anon";
    return `favoritos_estudante_${userId}`;
  }

  function loadFavorites() {
    try {
      const raw = localStorage.getItem(getFavoritesKey());
      const parsed = raw ? JSON.parse(raw) : [];
      setFavorites(Array.isArray(parsed) ? parsed : []);
    } catch (_e) {
      setFavorites([]);
    }
  }

  function saveFavorites(next) {
    setFavorites(next);
    try {
      localStorage.setItem(getFavoritesKey(), JSON.stringify(next));
    } catch (_e) {}
  }

  function makeProposalKey(p) {
    const id = p.id || p._id || p.proposta_id || null;
    if (id) return String(id);
    return [p.nome, p.localizacao, p.data_submissao, p.categoria, p.vaga]
      .map((x) => (x == null ? "" : String(x)))
      .join("|#|");
  }

  function removeFavorite(p) {
    const key = makeProposalKey(p);
    const next = favorites.filter((f) => makeProposalKey(f) !== key);
    saveFavorites(next);
  }

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
              <div className="container-fluid main-content d-flex align-items-center justify-content-center">
                <div className="d-flex flex-column w-100">
                  <div className="inicio-admin">
                    <div className="cards-wrapper d-flex flex-wrap gap-4 justify-content-center">
                      {favorites.length === 0 ? (
                        <div className="text-center w-100">
                          <div className="alert alert-info">Nenhuma proposta nos favoritos.</div>
                        </div>
                      ) : (
                        favorites.map((data, index) => (
                          <div className="card-component" key={index}>
                            <Card
                              empresa={data.nome || data.empresa || "Empresa"}
                              localizacao={data.localizacao}
                              dataSubmissao={data.data_submissao || data.dataSubmissao}
                              categoria={data.categoria}
                              vaga={data.vaga}
                              imagem={Logo}
                              isBookmarked={true}
                              onToggleFavorite={() => removeFavorite(data)}
                              onViewDetails={null}
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

export default EstudanteFavoritos;

