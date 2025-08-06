import "../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import Logo from "../imgs/logo1.png";

function RegistoAdmin() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // para redirecionar após registo

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação simples
    if (!nome || !email || !password) {
      setMensagem("Por favor preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    setMensagem("");

    try {
      const resposta = await fetch("http://localhost:3000/api/utilizadores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          senha: password,
          idtuser: 1, // administrador
        }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setMensagem("Registo efetuado com sucesso! Pode agora fazer login.");
        setNome("");
        setEmail("");
        setPassword("");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMensagem(dados.message || dados.error || "Erro ao registar.");
      }
    } catch (erro) {
      setMensagem("Erro de ligação ao servidor.");
    }

    setLoading(false);
  };

  const handleRoleChoice = () => {
    localStorage.setItem("profile", JSON.stringify("admin"));
  };

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
            <div className="row">
              <h1 className="col-12 fw-bold titles-mobile" style={{ fontSize: "5em" }}>
                Comece agora!
              </h1>
            </div>
            <div className="row mb-3">
              <p className="col-12 fw-semibold">
                Junte-se à equipa para gerir e ter controlo sobre toda a informação.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Nome */}
              <div className="mb-3 text-start">
                <label htmlFor="nome" className="form-label">
                  Nome <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control form_input"
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-3 text-start">
                <label htmlFor="pass" className="form-label">
                  Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  className="form-control form_input"
                  id="pass"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Mensagem */}
              {mensagem && (
                <div className="alert alert-info" role="alert">
                  {mensagem}
                </div>
              )}

              <button type="submit" className="btn btn-primary mb-1 mt-3" disabled={loading}>
                {loading ? "A registar..." : "Registar"}
              </button>

              <div className="col-12 mb-3">
                Já possui conta?
                <Link to="/" className="link-primary" onClick={handleRoleChoice}>
                  {" "}Entre aqui
                </Link>.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistoAdmin;
