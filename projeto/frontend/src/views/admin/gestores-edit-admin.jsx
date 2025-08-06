import "../../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

import SideBar from "../../components/sidebaradm";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

import Logo from "../../imgs/logo1.png";

function GestoresEDITAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: ""
  });

  useEffect(() => {
    const fetchUtilizador = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3000/api/utilizadores/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Preenche os campos que queremos exibir
        setFormData({
          nome: response.data.nome || "",
          email: response.data.email || "",
          senha: "" // Nunca preenche a senha por questões de segurança
        });
      } catch (error) {
        console.error("Erro ao carregar utilizador:", error);
      }
    };
    if (id) {
      fetchUtilizador();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Preparar dados para envio - só nome, email e senha
    const dataToSend = {
      nome: formData.nome,
      email: formData.email,
    };

    // Se a senha foi preenchida, envia para atualizar
    if (formData.senha && formData.senha.trim() !== "") {
      dataToSend.senha = formData.senha;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3000/api/utilizadores/${id}`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Gestor atualizado com sucesso.");
      navigate("/adm/gestores");
    } catch (err) {
      alert("Erro ao atualizar: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Tens a certeza que queres eliminar este gestor?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/utilizadores/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Gestor eliminado com sucesso.");
      navigate("/adm/gestores");
    } catch (err) {
      console.error("Erro ao eliminar gestor:", err);
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
            <Navbar title={"Editar Gestor"} />
            <div className="d-flex flex-grow-1">
              <div className="container-fluid main-content d-flex align-items-center justify-content-center">
                <div className="d-flex flex-column">
                  <div className="inicio-admin">
                    <br />
                    <div
                      className="container-fluid p-3 rounded"
                      style={{ background: "#f8f9fa", border: "1px solid #314B66", color: "#314B66" }}
                    >
                      <div className="d-flex justify-content-md-end justify-content-center">
                        <Link to={"/adm/gestores"} className="btn_custom bg-transparent text-decoration-none">
                          Voltar
                        </Link>
                      </div>
                      <div className="row d-flex justify-content-center align-items-md-start align-items-sm-start">
                        <div className="col-md-3 col-sm-12">
                          <div className="image-hover-wrapper position-relative">
                            <img src={Logo} alt="Logo" className="w-100 company_logo" />
                            <div className="hover-text mx-2">Mudar Imagem</div>
                          </div>
                        </div>
                        <div className="col-md-9 col-sm-12">
                          <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                              <label className="form-label">Nome Completo *</label>
                              <input
                                type="text"
                                name="nome"
                                className="form-control form_input"
                                value={formData.nome}
                                onChange={handleChange}
                                required
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Email *</label>
                              <input
                                type="email"
                                name="email"
                                className="form-control form_input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Senha</label>
                              <input
                                type="password"
                                name="senha"
                                className="form-control form_input"
                                placeholder="Deixe vazio para não alterar"
                                value={formData.senha}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="row mb-3">
                              <div className="col-md-4 col-sm-12">
                                <button
                                  type="button"
                                  className="btn btn-danger mb-1 mt-3 w-100"
                                  onClick={() => navigate("/adm/gestores")}
                                >
                                  Cancelar
                                </button>
                              </div>
                              <div className="col-md-4 col-sm-12">
                                <button type="submit" className="btn btn-primary mb-1 mt-3 w-100">
                                  Atualizar
                                </button>
                              </div>
                              {id && (
                                <div className="col-md-4 col-sm-12">
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger mb-1 mt-3 w-100"
                                    onClick={handleDelete}
                                  >
                                    Apagar
                                  </button>
                                </div>
                              )}
                            </div>
                          </form>
                        </div>
                      </div>
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

export default GestoresEDITAdmin;
