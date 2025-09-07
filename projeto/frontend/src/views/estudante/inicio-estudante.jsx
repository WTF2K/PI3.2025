import "../../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faFilter,
  faCalendar,
  faMapMarker,
  faAt,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";

import SideBar from "../../components/sidebarestudante";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Card from "../../components/card";

import Logo from "../../imgs/logo1.png";

function InicioEstudante() {
  const topRef = useRef(null);
  const [DataPropostas, setDataPropostas] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [pedidoLoading, setPedidoLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchData();
    loadFavorites();
  }, []);

  function getFavoritesKey() {
    const userId = localStorage.getItem("iduser") || "anon";
    return `favoritos_estudante_${userId}`;
  }

  function loadFavorites() {
    try {
      const raw = localStorage.getItem(getFavoritesKey());
      if (!raw) return setFavorites([]);
      const parsed = JSON.parse(raw);
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

  function fetchData() {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/api/propostas/", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setDataPropostas(res.data);
      })
      .catch((error) => {
        alert("Erro de ligação à API: " + error.message);
      });
  }

  function makeProposalKey(p) {
    // Prefer id when available; fallback to a composite
    const id = p.id || p._id || p.proposta_id || null;
    if (id) return String(id);
    return [p.nome, p.localizacao, p.data_submissao, p.categoria, p.vaga]
      .map((x) => (x == null ? "" : String(x)))
      .join("|#|");
  }

  function isFavorite(p) {
    const key = makeProposalKey(p);
    return favorites.some((f) => makeProposalKey(f) === key);
  }

  function handleToggleFavorite(p) {
    const key = makeProposalKey(p.raw || p);
    const exists = favorites.some((f) => makeProposalKey(f) === key);
    if (exists) {
      const next = favorites.filter((f) => makeProposalKey(f) !== key);
      saveFavorites(next);
    } else {
      const toStore = p.raw || p;
      saveFavorites([{ ...toStore }, ...favorites]);
    }
  }

  async function pedirRemocaoConta() {
    try {
      setPedidoLoading(true);
      const token = localStorage.getItem("token");
      const iduser = localStorage.getItem("iduser");
      await axios.put(
        `http://localhost:3000/api/utilizadores/${iduser}/pedir-remocao`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Pedido de remoção enviado ao gestor.");
    } catch (err) {
      alert("Erro ao enviar pedido: " + (err.response?.data?.error || err.message));
    } finally {
      setPedidoLoading(false);
    }
  }

  const filteredPropostas = useMemo(() => {
    const query = (searchText || "").toLowerCase().trim();
    if (!query) return DataPropostas;
    return DataPropostas.filter((p) => {
      const nome = (p.nome || "").toLowerCase();
      const categoria = (p.categoria || "").toLowerCase();
      const vaga = (p.vaga || "").toLowerCase();
      const localizacao = (p.localizacao || "").toLowerCase();
      return (
        nome.includes(query) ||
        categoria.includes(query) ||
        vaga.includes(query) ||
        localizacao.includes(query)
      );
    });
  }, [DataPropostas, searchText]);

  return (
    <div className="main-wrapper">
      <div className="d-flex flex-column">
        <div className="d-md-flex flex-row justify-content-between">
          <div className="col-md-3 col-sm-1">
            <SideBar />
          </div>
          <div className="col-md-9 col-sm-12">
            <Navbar title={"Início"} />
            <div className="d-flex flex-grow-1">
              <div className="container-fluid main-content d-flex align-items-center justify-content-center">
                <div className="d-flex flex-column">
                  <div className="inicio-admin">
                    <div className="mb-3 d-flex justify-content-end">
                      <button
                        className="btn btn-outline-danger"
                        onClick={pedirRemocaoConta}
                        disabled={pedidoLoading}
                      >
                        {pedidoLoading ? "A enviar..." : "Pedir desativação da conta"}
                      </button>
                    </div>
                    {/* Search bar */}
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
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                          />
                        </div>
                        <div className="d-flex flex-row justify-content-between">
                          <div className="col-3">
                            <button
                              className="search-btn btn form_input rounded-0"
                              onClick={() => setSearchText((t) => t.trim())}
                            >
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

                    {/* Detalhes da proposta */}
                    {selectedDetails && (
                      <div
                        className="card mb-4 p-3 w-100"
                        style={{ background: "#f8f9fa", border: "1px solid #314B66" }}
                        ref={topRef}
                      >
                        <div className="d-flex justify-content-md-end justify-content-center">
                          <button
                            className="btn_custom bg-transparent"
                            onClick={() => setSelectedDetails(null)}
                          >
                            Voltar
                          </button>
                        </div>
                        <div className="row d-flex justify-content-center align-items-md-center align-items-sm-start">
                          <div className="col-md-3 col-sm-9">
                            <img
                              src={selectedDetails.imagem || Logo}
                              alt=""
                              className="w-100"
                            />
                          </div>
                          <div className="col-md-9 col-sm-12">
                            <h1 className="card-title fw-bolder" style={{ color: "#314B66" }}>
                              {selectedDetails.nome || "Empresa"}
                            </h1>
                            <div className="fs-5 d-md-flex flex-row align-items-center gap-4">
                              <p>
                                <b className="me-2"><FontAwesomeIcon icon={faCalendar} /></b>
                                {selectedDetails.data_submissao}
                              </p>
                              <p>
                                <b className="me-2"><FontAwesomeIcon icon={faMapMarker} /></b>
                                {selectedDetails.localizacao}
                              </p>
                              <p>
                                <b className="me-2"><FontAwesomeIcon icon={faAt} /></b>
                                {selectedDetails.email || "empresa@gmail.com"}
                              </p>
                              <p>
                                <b className="me-2"><FontAwesomeIcon icon={faPhone} /></b>
                                {selectedDetails.telefone || "921645222"}
                              </p>
                            </div>

                            {/* Segunda secção */}
                            <div className="fs-5 d-md-flex flex-row align-items-center gap-4">
                              <p>
                                <b className="tag-label rounded px-2 text-white">Área de trabalho</b>
                                <br />
                                {selectedDetails.categoria}
                              </p>
                              <p>
                                <b className="tag-label rounded px-2 text-white">Ocupação</b>
                                <br />
                                {selectedDetails.vaga}
                              </p>
                              <p>
                                <b className="tag-label rounded px-2 text-white">Tipo de Proposta</b>
                                <br />
                                {selectedDetails.tipoProposta || "Estágio"}
                              </p>
                            </div>

                            {/* Terceira secção */}
                            <h4 className="card-title">Detalhes da Oferta</h4>
                            <p>
                              <b className="tag-label rounded px-2 text-white">O que vai fazer</b>
                              <br />
                              {selectedDetails.descricao || "Sem descrição disponível."}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Cards com os dados reais */}
                    <div className="cards-wrapper d-flex flex-wrap gap-4 justify-content-center">
                      {filteredPropostas.length === 0 ? (
                        <div className="text-center w-100">
                          <div className="alert alert-info">
                            {searchText ? 
                              `Nenhuma proposta encontrada para "${searchText}".` : 
                              "Nenhuma proposta disponível no momento."
                            }
                          </div>
                        </div>
                      ) : (
                        filteredPropostas.map((data, index) => (
                        <div className="card-component" key={index}>
                          <Card
                            empresa={data.nome || "Empresa"}
                            localizacao={data.localizacao}
                            dataSubmissao={data.data_submissao}
                            categoria={data.categoria}
                            vaga={data.vaga}
                            imagem={Logo}
                            isBookmarked={isFavorite(data)}
                            onToggleFavorite={() => handleToggleFavorite({ raw: data })}
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

export default InicioEstudante;
