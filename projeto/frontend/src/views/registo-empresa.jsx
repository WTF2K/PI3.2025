import "../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

import Logo from "../imgs/logo1.png";

function FormEmpresa() {
  const [formData, setFormData] = useState({
    nome: "",
    localizacao: "",
    categoria: "",
    email: "",
    telefone: "",
    senha: "",
    logotipo: "",
  });

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Atualizar formData ao mudar campos
  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Validação simples
    if (
      !formData.nome ||
      !formData.localizacao ||
      !formData.categoria ||
      !formData.email ||
      !formData.telefone ||
      !formData.senha
    ) {
      setErro("Por favor preencha todos os campos obrigatórios.");
      return;
    }

    setErro("");
    setSucesso("");

    // Preparar dados para enviar ao backend
    const dadosEnviar = {
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      idtuser: 3, // Empresa
      localizacao: formData.localizacao,
      categoria: formData.categoria,
      telefone: formData.telefone,
      logotipo: formData.logotipo,
    };

    try {
      const resposta = await fetch("http://localhost:3000/api/utilizadores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosEnviar),
      });

      if (!resposta.ok) {
        const dataErro = await resposta.json();
        setErro(dataErro.message || "Erro ao registar empresa.");
        return;
      }

      setSucesso("Empresa registada com sucesso!");
      setFormData({
        nome: "",
        localizacao: "",
        categoria: "",
        email: "",
        telefone: "",
        senha: "",
        logotipo: "",
      });
    } catch (error) {
      setErro("Erro ao comunicar com o servidor.");
    }
  }

  return (
    <div className="container-fluid text-center min-vh-100 d-flex align-items-stretch">
      <div className="row flex-grow-1 w-100">
        <div className="col-6 d-md-flex d-md-block d-none align-items-center justify-content-center bg-light">
          <img src={Logo} alt="Logo" style={{ width: "90%" }} />
        </div>
        <div
          className="col-md-6 col-sm-12 d-flex align-items-center justify-content-center text-white"
          style={{ backgroundColor: "#D9EBFF" }}
        >
          <div className="container-fluid" style={{ color: "#314B66" }}>
            <h1 className="fw-bold titles-mobile" style={{ fontSize: "5em" }}>
              Comece agora!
            </h1>
            <p className="fw-semibold">
              Junte-se como empresa e dê a oportunidade a novos talentos no mundo
              do trabalho!
            </p>

            <form onSubmit={handleSubmit}>
              {/* Nome Empresa e Localização */}
              <div className="d-flex flex-row justify-content-between">
                <div className="mb-3 text-start col-6 me-1">
                  <label htmlFor="nome" className="form-label">
                    Nome da Empresa <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form_input"
                    id="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3 text-start col-6">
                  <label htmlFor="localizacao" className="form-label">
                    Localização <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form_input"
                    id="localizacao"
                    value={formData.localizacao}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Categoria */}
              <div className="mb-3 text-start">
                <label htmlFor="categoria" className="form-label">
                  Categoria <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control form_input"
                  id="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email e Telefone */}
              <div className="d-flex flex-row justify-content-between">
                <div className="mb-3 text-start col-8 me-1">
                  <label htmlFor="email" className="form-label">
                    E-mail <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control form_input"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3 text-start col-4">
                  <label htmlFor="telefone" className="form-label">
                    Telefone <span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    className="form-control form_input"
                    id="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password e Logotipo */}
              <div className="d-flex flex-row justify-content-between">
                <div className="mb-3 text-start col-8 me-1">
                  <label htmlFor="senha" className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control form_input"
                    id="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3 text-start col-4">
                  <label htmlFor="logotipo" className="form-label">
                    Logotipo
                  </label>
                  <input
                    type="text"
                    className="form-control form_input"
                    id="logotipo"
                    value={formData.logotipo}
                    onChange={handleChange}
                    placeholder="URL do logotipo"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary mb-1 mt-3">
                Registar
              </button>

              {erro && <div className="alert alert-danger">{erro}</div>}
              {sucesso && <div className="alert alert-success">{sucesso}</div>}

              <div className="col-12 mb-3">
                Já possui conta?{" "}
                <Link
                  to="/"
                  className="link-primary"
                  onClick={() => localStorage.setItem("profile", "empresa")}
                >
                  Entre aqui
                </Link>
                .
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormEmpresa;
