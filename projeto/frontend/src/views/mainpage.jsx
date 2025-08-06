import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import "../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";

import Logo from "../imgs/logo1.png"

function ContainerR () {

  const [DataProfileChoice, setDataProfileChoice] = useState([]);

  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(DataProfileChoice));
  }, [DataProfileChoice]);

    return (
      <div className="container-fluid text-center min-vh-100 d-flex align-items-stretch">
        <div className="row flex-grow-1 w-100">
          <div className="col-6 d-md-flex d-md-block d-none align-items-center justify-content-center bg-light">
            <img src={Logo} alt="" className="" style={{width: "90%"}}/>
          </div>
          <div className="col-md-6 col-sm-12 d-flex align-items-center justify-content-center text-white"  style={{backgroundColor: "#D9EBFF"}}>
          <div className="container-fluid" style={{color: "#314B66"}}>
          <div className="row">
              <h1 className="col-12 fw-bold" style={{fontSize: "5em"}}>Comece agora!</h1>
            </div>
            <div className="row mb-5">
              <p className="col-12 fw-semibold">Junte-se à equipa para gerir e ter controlo sobre a informação.</p>
            </div>
            <div className="row">
             <h2 className="col-12 hover-fs"><Link className="text-decoration-none"  to="/form-estudante">Estudante</Link></h2>
            </div>
            <div className="row">
              <h2 className="col-12 hover-fs"><Link to="/form-empresa" className="text-decoration-none">Empresa</Link></h2>
            </div>
            <div className="row">
              <h2 className="col-12 hover-fs"><Link to="/form-gestor" className="text-decoration-none">Gestor</Link></h2>
            </div>
            <div className="row">
              <h2 className="col-12 hover-fs"><Link to="/form-admin" className="text-decoration-none">Administrador</Link></h2>
            </div>
            <div className="row mt-5">
              <div className="col-12 mb-5">Já possui conta? <Link to="/" className="link-primary"  onClick={() => setDataProfileChoice('estudante')}>Entre aqui</Link>.</div>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
}

export default ContainerR;
