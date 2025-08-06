import "../../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

import SideBar from "../../components/sidebarestudante";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

import Logo from "../../imgs/logo1.png";

function EstudantesEDITPerfilestudante() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [count, setCount] = useState(0);

  // Supomos que o id do utilizador está guardado no localStorage como 'iduser'
  const iduser = localStorage.getItem("iduser");

  useEffect(() => {
    if (!iduser) {
      alert("Utilizador não autenticado.");
      navigate("/"); // redireciona para login se não estiver autenticado
      return;
    }

    const fetchUtilizador = async () => {
      try {
        const token = localStorage.getItem("token");
        // vai buscar os dados do próprio utilizador com iduser
        const response = await axios.get(`http://localhost:3000/api/utilizadores/${iduser}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.idtuser !== 4) {
          alert("Acesso negado: tipo de utilizador inválido.");
          navigate("/"); // redirecionar ou tratar acesso negado
          return;
        }

        setFormData(response.data);
        setCount(response.data.competencias?.length || 0);
      } catch (error) {
        console.error("Erro ao carregar utilizador:", error);
        alert("Erro ao carregar dados do utilizador.");
      }
    };

    fetchUtilizador();
  }, [iduser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "competencias") setCount(value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      // Só envia os campos válidos do modelo
      const payload = {
        nome: formData.nome,
        email: formData.email,
        interesses: formData.interesses,
        percurso: formData.percurso,
        curso: formData.curso,
        ano: formData.ano,
        competencias: formData.competencias,
        // Não inclui telefone/localizacao pois não existem no modelo
      };
      await axios.put(`http://localhost:3000/api/utilizadores/${iduser}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Utilizador atualizado com sucesso.");
      navigate("/estudante/perfil");
    } catch (err) {
      alert("Erro ao atualizar: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Tens a certeza que queres eliminar este perfil?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/utilizadores/${iduser}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Perfil eliminado com sucesso.");
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error("Erro ao eliminar utilizador:", err);
      alert("Erro ao eliminar: " + (err.response?.data?.error || err.message));
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
            <Navbar title={"Editar Perfil"} />
            <div className="d-flex flex-grow-1">
              <div className="container-fluid main-content d-flex align-items-center justify-content-center">
                <div className="d-flex flex-column">
                  <div className="inicio-admin">
                    <br />
                    <div
                      className="container-fluid p-3 rounded"
                      style={{ background: "#f8f9fa", border: "1px solid #314B66", color: "#314B66" }}
                    >
                      <form onSubmit={handleSubmit}>
                        <div className="row d-flex justify-content-center align-items-md-start align-items-sm-start">
                          <div className="col-md-3 col-sm-12">
                            <img src={Logo} alt="" className="w-100 company_logo" />
                          </div>
                          <div className="col-md-9 col-sm-12">
                            <div className="row mb-3">
                              <div className="col-md-6 col-sm-12">
                                <label className="form-label">Nome Completo *</label>
                                <input
                                  type="text"
                                  name="nome"
                                  className="form-control form_input"
                                  value={formData.nome || ""}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                              <div className="col-md-6 col-sm-12">
                                <label className="form-label">Email *</label>
                                <input
                                  type="email"
                                  name="email"
                                  className="form-control form_input"
                                  value={formData.email || ""}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>

                            <div className="row mb-3">
                              <div className="col-md-6 col-sm-12">
                                <label className="form-label">Área de Interesse Pessoal *</label>
                                <input
                                  type="text"
                                  name="interesses"
                                  className="form-control form_input"
                                  value={formData.interesses || ""}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                              <div className="col-md-6 col-sm-12">
                                <label className="form-label">Percurso Profissional</label>
                                <input
                                  type="text"
                                  name="percurso"
                                  className="form-control form_input"
                                  value={formData.percurso || ""}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>

                            <div className="row mb-3">
                              <div className="col-md-6 col-sm-12">
                                <label className="form-label">Curso *</label>
                                <input
                                  type="text"
                                  name="curso"
                                  className="form-control form_input"
                                  value={formData.curso || ""}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                              {/*
                              <div className="col-md-3 col-sm-12">
                                <label className="form-label">Telemóvel</label>
                                <input
                                  type="tel"
                                  name="telefone"
                                  className="form-control form_input"
                                  value={formData.telefone || ""}
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="col-md-3 col-sm-12">
                                <label className="form-label">Localidade</label>
                                <input
                                  type="text"
                                  name="localizacao"
                                  className="form-control form_input"
                                  value={formData.localizacao || ""}
                                  onChange={handleChange}
                                />
                              </div>
                              */}
                            </div>

                            <div className="row mb-3">
                              <div className="col-md-2 col-4">
                                <label className="form-label">Ano *</label>
                                <input
                                  type="number"
                                  name="ano"
                                  className="form-control form_input"
                                  value={formData.ano || ""}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>

                            <div className="row mb-3">
                              <div className="col-12">
                                <div className="d-inline-flex justify-content-between w-100">
                                  <label className="form-label">Competências & Soft Skills</label>
                                  <p>{count}/500</p>
                                </div>
                                <textarea
                                  name="competencias"
                                  className="form-control form_input"
                                  rows={5}
                                  maxLength={500}
                                  value={formData.competencias || ""}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>

                            <div className="row mb-3">
                              <div className="col-md-4 col-sm-12">
                                <button
                                  type="button"
                                  className="btn btn-danger mb-1 mt-3 w-100"
                                  onClick={() => navigate("/estudante/perfil")}
                                >
                                  Cancelar
                                </button>
                              </div>
                              <div className="col-md-4 col-sm-12">
                                <button type="submit" className="btn btn-primary mb-1 mt-3 w-100">
                                  Atualizar
                                </button>
                              </div>
                              <div className="col-md-4 col-sm-12">
                                <button
                                  type="button"
                                  className="btn btn-outline-danger mb-1 mt-3 w-100"
                                  onClick={handleDelete}
                                >
                                  Eliminar Perfil
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                    <br />
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EstudantesEDITPerfilestudante;
