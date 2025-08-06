import "../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

import Logo from "../imgs/logo1.png";

function Form() {
  const [formData, setFormData] = useState({
    nome: "",
    areaInteresse: "0",
    competencias: "",
    percurso: "",
    telemovel: "",
    localidade: "",
    email: "",
    senha: "",
    curso: "",
    ano: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [DataProfileChoice, setDataProfileChoice] = useState("");

  useEffect(() => {
    localStorage.setItem("profile", JSON.stringify(DataProfileChoice));
  }, [DataProfileChoice]);

  function handleChange(e) {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.nome ||
      !formData.email ||
      !formData.senha ||
      !formData.telemovel ||
      !formData.localidade ||
      !formData.curso ||
      !formData.ano ||
      formData.areaInteresse === "0"
    ) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const payload = {
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      telemovel: formData.telemovel,
      localidade: formData.localidade,
      curso: formData.curso,
      ano: formData.ano,
      percurso: formData.percurso,
      competencias: formData.competencias,
      areaInteresse: formData.areaInteresse,
      idtuser: 4,
    };

    console.log("Payload a enviar:", payload);

    try {
      const res = await fetch("http://localhost:3000/api/utilizadores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro no registo");
      }

      setSuccess("Registo efetuado com sucesso!");
      setFormData({
        nome: "",
        areaInteresse: "0",
        competencias: "",
        percurso: "",
        telemovel: "",
        localidade: "",
        email: "",
        senha: "",
        curso: "",
        ano: "",
      });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container-fluid text-center min-vh-100 d-flex align-items-stretch">
      <div className="row flex-grow-1 w-100">
        <div className="col-6 d-md-flex d-md-block d-none align-items-center justify-content-center bg-light">
          <img src={Logo} alt="" style={{ width: "90%" }} />
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
                Junte-se como aluno e procure novas oportunidades que podem definir o seu futuro!
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

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

              <div className="d-flex flex-row justify-content-between">
                <div className="mb-3 text-start col-6 me-1">
                  <label htmlFor="areaInteresse" className="form-label">
                    Área de Interesse Pessoal <span className="text-danger">*</span>
                  </label>
                  <select
                    id="areaInteresse"
                    className="form-control form_input"
                    value={formData.areaInteresse}
                    onChange={handleChange}
                    required
                  >
                    <option value="0">....</option>
                    <option value="1">Admin</option>
                    <option value="2">Project Manager</option>
                    <option value="3">Programer</option>
                  </select>
                </div>

                <div className="mb-3 text-start col-6">
                  <label htmlFor="competencias" className="form-label">
                    Competências & Soft Skills
                  </label>
                  <input
                    type="text"
                    className="form-control form_input"
                    id="competencias"
                    value={formData.competencias}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="d-flex flex-row justify-content-between">
                <div className="mb-3 text-start col-6 me-1">
                  <label htmlFor="percurso" className="form-label">
                    Percurso Profissional
                  </label>
                  <input
                    type="text"
                    className="form-control form_input"
                    id="percurso"
                    value={formData.percurso}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3 text-start col-6">
                  <label htmlFor="telemovel" className="form-label">
                    Telemóvel <span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    className="form-control form_input"
                    id="telemovel"
                    value={formData.telemovel}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="d-flex flex-row justify-content-between">
                <div className="mb-3 text-start col-6 me-1">
                  <label htmlFor="localidade" className="form-label">
                    Localidade <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form_input"
                    id="localidade"
                    value={formData.localidade}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3 text-start col-6">
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
              </div>

              <div className="d-md-flex flex-row justify-content-between">
                <div className="text-start col-md-6 col-sm-12">
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

                <div className="d-flex flex-row justify-content-between">
                  <div className="text-start col-10 ps-1">
                    <label htmlFor="curso" className="form-label">
                      Curso <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form_input"
                      id="curso"
                      value={formData.curso}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="text-start ms-1 col-2">
                    <label htmlFor="ano" className="form-label">
                      Ano <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control form_input"
                      id="ano"
                      value={formData.ano}
                      min={0}
                      max={9}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <br />
              <br />
              <button type="submit" className="btn btn-primary mb-1">
                Registar
              </button>
              <div className="col-12 mb-5">
                Já possui conta?{" "}
                <Link
                  to="/"
                  className="link-primary"
                  onClick={() => setDataProfileChoice("estudante")}
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

export default Form;
