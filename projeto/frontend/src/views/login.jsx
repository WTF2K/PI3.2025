import "../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Logo from "../imgs/logo1.png";

function Login() {
  const [DataProfile, setDataProfile] = useState("estudante");
  const [InputLogin, setDataLogin] = useState("");
  const [InputPassword, setDataPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [InputNome, setInputNome] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem("profile"));
    if (storedProfile) {
      setDataProfile(storedProfile);
    }
  }, []);

  // Função para obter o ID do utilizador pelo nome (se necessário)
  const fetchUserIdByName = async (nome) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/utilizadores/nome/${nome}`
      );
      const data = await response.json();

      if (response.ok && data && data.idtuser) {
        return data.idtuser;
      } else {
        throw new Error("Utilizador não encontrado.");
      }
    } catch (err) {
      console.error("Erro ao obter ID do utilizador:", err);
      throw err;
    }
  };

  const handleLogin = async (e) => {
  e.preventDefault();

  // Mapeia o tipo de utilizador para idtuser (exemplo)
  const perfilParaId = {
    estudante: 4,
    empresa: 3,
    gestor: 2,
    admin: 1,
  };

  const idtuser = perfilParaId[DataProfile];

  // Debug logging
  console.log('DataProfile:', DataProfile);
  console.log('idtuser:', idtuser);
  console.log('Request payload:', {
    nome: InputNome,
    email: InputLogin,
    senha: InputPassword,
    idtuser: idtuser,
  });

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: InputNome,
        email: InputLogin,
        senha: InputPassword,
        idtuser: idtuser,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("profile", JSON.stringify(data.user.tipo));
      console.log("data.user:", data.user); // <-- Adiciona isto para veres o objeto completo
      localStorage.setItem("iduser", data.user.id); // id do utilizador (sempre)
      if (data.user.idempresa) {
        localStorage.setItem("idempresa", data.user.idempresa); // id da empresa (se for empresa)
      }
      localStorage.setItem("nome", data.user.nome || "");

      console.log("Login successful, navigating to:", data.user.tipo);
      console.log("LocalStorage after login:", {
        token: localStorage.getItem("token"),
        iduser: localStorage.getItem("iduser"),
        idempresa: localStorage.getItem("idempresa"),
        nome: localStorage.getItem("nome"),
        profile: localStorage.getItem("profile")
      });

      switch (data.user.tipo) {
        case 4:
          console.log("Navigating to estudante dashboard");
          navigate("/estudante/dashboard");
          break;
        case 3:
          console.log("Navigating to empresa debug page");
          navigate("/empresa/inicio");
          break;
        case 2:
          console.log("Navigating to gestor dashboard");
          navigate("/gestor/dashboard2");
          break;
        case 1:
          console.log("Navigating to admin dashboard");
          navigate("/adm/dashboard");
          break;
        default:
          console.log("Unknown user type, navigating to home");
          navigate("/");
          break;
      }
    } else {
      setErrorMessage(data.error || data.message || "Erro no login");
    }
  } catch (error) {
    setErrorMessage("Erro ao tentar iniciar sessão.");
  }
};


  return (
    <div className="container-fluid text-center min-vh-100 d-flex align-items-stretch">
      <div className="row flex-grow-1 w-100">
        {/* Lado esquerdo (imagem logo) — só visível em md+ */}
        <div className="col-6 d-md-flex d-md-block d-none align-items-center justify-content-center bg-light">
          <img src={Logo} alt="Logo" style={{ width: "90%" }} />
        </div>

        {/* Lado direito (formulário de login) */}
        <div
          className="col-md-6 col-sm-12 d-flex align-items-center justify-content-center text-white"
          style={{ backgroundColor: "#D9EBFF" }}
        >
          <div className="container-fluid" style={{ color: "#314B66" }}>
            <h1
              className="fw-bold text-md-start text-center titles-mobile"
              style={{ fontSize: "5em" }}
            >
              Bem-Vindo!
            </h1>
            <p className="fw-semibold text-start mb-4">
              Somos uma equipa apaixonada em web design e software, criando
              soluções digitais intuitivas e eficazes. Desenvolvemos websites,
              aplicações e software acessíveis, modernos e fáceis de usar,
              sempre alinhados com a visão dos nossos clientes.
            </p>

            {/* Seletor de perfil para ecrãs maiores */}
            <div className="container w-75">
              <div className="d-none d-md-flex flex-row justify-content-between profile-selector mb-3">
                {["estudante", "empresa", "gestor", "admin"].map((profile) => (
                  <div
                    key={profile}
                    id={DataProfile === profile ? "profile-selected" : ""}
                    className="text-start col-3 text-center"
                    onClick={() => {
                    console.log('Profile selected:', profile);
                    setDataProfile(profile);
                    localStorage.setItem("profile", JSON.stringify(profile));
                  }}
                    style={{ cursor: "pointer" }}
                  >
                    {profile.charAt(0).toUpperCase() + profile.slice(1)}
                  </div>
                ))}
              </div>
            </div>

            {/* Seletor de perfil para ecrãs pequenos */}
            <div className="d-flex d-sm-flex d-md-none flex-row justify-content-between profile-selector mb-3">
              {["estudante", "empresa", "gestor", "admin"].map((profile) => (
                <div
                  key={profile}
                  id={DataProfile === profile ? "profile-selected" : ""}
                  className="text-start col-3 text-center"
                  onClick={() => {
                    console.log('Profile selected:', profile);
                    setDataProfile(profile);
                    localStorage.setItem("profile", JSON.stringify(profile));
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {profile.charAt(0).toUpperCase() + profile.slice(1)}
                </div>
              ))}
            </div>

            <div className="container w-75 mb-3">
              <small className="text-muted">Perfil selecionado: <strong>{DataProfile}</strong> (ID: {DataProfile === "estudante" ? 4 : DataProfile === "empresa" ? 3 : DataProfile === "gestor" ? 2 : DataProfile === "admin" ? 1 : "N/A"})</small>
            </div>

            {/* Formulário de login */}
            <form onSubmit={handleLogin} className="container w-75">
              {/* Nome */}
              <div className="mb-3 text-start">
                <label htmlFor="nome" className="form-label">
                  Nome <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control form_input"
                  id="nome"
                  value={InputNome}
                  onChange={(e) => setInputNome(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-3 text-start">
                <label htmlFor="user" className="form-label">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className="form-control form_input"
                  id="user"
                  aria-describedby="userHelp"
                  value={InputLogin}
                  onChange={(e) => setDataLogin(e.target.value)}
                  required
                />
                <div id="userHelp" className="form-text">
                  {/* Espaço para mensagem de ajuda */}
                </div>
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
                  aria-describedby="passHelp"
                  value={InputPassword}
                  onChange={(e) => setDataPassword(e.target.value)}
                  required
                />
                <div id="passHelp" className="form-text">
                  <Link to="" className="link-primary">
                    Esqueceu-se da palavra-passe?
                  </Link>
                </div>
              </div>

              {/* Mensagem de erro */}
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}

              <button type="submit" className="btn btn-primary w-100 mb-3">
                Entrar
              </button>

              <div className="col-12 mb-3">
                Ainda não possui conta?{" "}
                <Link to="/regist-select" className="link-primary">
                  Peça o seu registo aqui
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

export default Login;
