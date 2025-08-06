import "../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import React, { useState } from "react";

import Logo from "../imgs/logo1.png";

function FormGestor() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    departamento: "",
    cargo: "",
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
      !formData.email ||
      !formData.telefone ||
      !formData.senha ||
      !formData.departamento ||
      !formData.cargo
    ) {
      setErro("Por favor preencha todos os campos obrigatórios.");
      return;
    }

    setErro("");
    setSucesso("");

    const dadosEnviar = {
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      idtuser: 2, // Gestor
      telefone: formData.telefone,
      departamento: formData.departamento,
      cargo: formData.cargo,
    };

    try {
      const resposta = await fetch("http://localhost:3000/api/utilizadores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosEnviar),
      });

      if (!resposta.ok) {
        const dataErro = await resposta.json();
        setErro(dataErro.message || "Erro ao registar gestor.");
        return;
      }

      setSucesso("Gestor registado com sucesso!");
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        senha: "",
        departamento: "",
        cargo: "",
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
              Junte-se como gestor e ajude a criar oportunidades para talentos!
            </p>

            <form onSubmit={handleSubmit}>
              {/* Nome */}
              <div className="mb-3 text-start">
                <label htmlFor="nome" className="form-label">
                  Nome Completo <span className="text-danger">*</span>
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

              {/* Email */}
              <div className="mb-3 text-start">
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

              {/* Telefone */}
              <div className="mb-3 text-start">
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

              {/* Password */}
              <div className="mb-3 text-start">
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

              {/* Departamento */}
              <div className="mb-3 text-start">
                <label htmlFor="departamento" className="form-label">
                  Departamento <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control form_input"
                  id="departamento"
                  value={formData.departamento}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Cargo */}
              <div className="mb-3 text-start">
                <label htmlFor="cargo" className="form-label">
                  Cargo <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control form_input"
                  id="cargo"
                  value={formData.cargo}
                  onChange={handleChange}
                  required
                />
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
                  onClick={() => localStorage.setItem("profile", "gestor")}
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

export default FormGestor;
