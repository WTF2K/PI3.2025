//import { useState } from "react";
import "../App.css";

import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

import MainPage from "./mainpage";
import RegiAluno from "./registo-aluno";
import RegiEmpresa from "./registo-empresa";
import RegiGestor from "./registo-gestor";
import RegiAdmin from "./registo-admin";
import Login from "./login";
{
  /* Inicio ESTUDANTE ⇩*/
}
import PerfilEstudante from "./perfil-estudante";
import EstudantesEDITPerfilestudante from "./estudante/estudantes-edit-estudante";
import InicioEstudante from "./estudante/inicio-estudante";
import EstudanteFavoritos from "./estudante/estudante-favoritos";
{
  /* Inicio EMPRESA ⇩*/

}
import PerfilEmpresa from "./perfil-empresa";
import EditarEmpresa from "./editar-empresa";
import InicioEmpresa from "./empresa/inicio-empresa";
import DashboardEmpresa from "./empresa/dashboard-empresa";
import PropostasEmpresa from "./empresa/propostas-list-empresa";
import PropostasADDEmpresa from "./empresa/propostas-add-empresa";
import PropostasEditEmpresa from "./empresa/propostas-edit-empresa";
import DebugEmpresa from "./empresa/debug-empresa";
{
  /* Inicio GESTOR ⇩*/
}
import InicioGestor from "./gestor/inicio-gestor";

import Dashboard2Gestor from "./gestor/dashboard2-gestor";
import EstudantesGestor from "./gestor/estudantes-gestor";
import PropostasValidateGestor from "./gestor/propostas-validate-gestor";
import PropostasADDGestor from "./gestor/propostas-add-gestor";
import PropostasEditGestor from "./gestor/propostas-edit-gestor";
import PropostasListGestor from "./gestor/propostas-list-gestor";

{
  /* Inicio ADMIN ⇩*/
}
import InicioAdmin from "./admin/inicio-admin";
import DashboardAdmin from "./admin/dashboard-admin";
import NotifAdmin from "./admin/notif-admin";
import PropostasAdmin from "./admin/propostas-list-admin";
import PropostasEDITAdmin from "./admin/propostas-edit-admin";
import PropostasADDAdmin from "./admin/propostas-add-admin";
import PropostasVALAdmin from "./admin/propostas-validate-admin";
import EstudantesAdmin from "./admin/estudantes-admin";
import EstudantesEDITAdmin from "./admin/estudantes-edit-admin";
import EstudantesValidateAdmin from "./admin/estudantes-validate-admin";
import EstudantesCreateAdmin from "./admin/estudantes-create-admin";
import EstudantesInativosAdmin from "./admin/estudantes-inativos-admin";
import GestoresAdmin from "./admin/gestores-admin";
import GestoresEDITAdmin from "./admin/gestores-edit-admin";
import UtilizadoresAdmin from "./admin/utilizadores-admin";


function App() {
  return (
    <Router>
      <Routes>
        {/* Registo */}
        <Route path="/regist-select" element={<MainPage />} />
        <Route path="/form-estudante" element={<RegiAluno />} />
        <Route path="/form-empresa" element={<RegiEmpresa />} />
        <Route path="/form-gestor" element={<RegiGestor />} />
        <Route path="/form-admin" element={<RegiAdmin />} />
        {/* Login */}
        <Route path="/" element={<Login />} />
        {/* Paginas */}
        {/* Estudantes */}
        <Route path="/estudante/perfil" element={<PerfilEstudante />} />
        <Route path="/estudante/:id" element={<EstudantesEDITPerfilestudante />} />
        <Route path="/estudante/dashboard" element={<InicioEstudante />} />
        <Route path="/estudante/favoritos" element={<EstudanteFavoritos />} />
        {/* Empresa */}
        <Route path="/empresa/inicio" element={<InicioEmpresa />} />
        <Route path="/empresa/dashboard" element={<DashboardEmpresa />} />
        <Route path="/empresa/:id" element={<PerfilEmpresa />} />
        <Route path="/empresa/:id/editar" element={<EditarEmpresa />} />
        <Route path="/empresa/propostas" element={<PropostasEmpresa />} />
        <Route path="/empresa/propostas/add" element={<PropostasADDEmpresa />} />
        <Route path="/empresas/propostas/:id" element={<PropostasEditEmpresa />} />
        <Route path="/empresas/propostas/:id/edit" element={<PropostasEditEmpresa />} />
        <Route path="/empresa/debug" element={<DebugEmpresa />} />
        {/* Gestor */}
        
        <Route path="/gestor/dashboard2" element={<Dashboard2Gestor />} />
        <Route path="/gestor/inicio" element={<InicioGestor />} />
        <Route path="/gestor/estudantes" element={<EstudantesGestor />} />
        <Route path="/gestor/propostas/add" element={<PropostasADDGestor />} />
        <Route path="/gestor/propostas/:id" element={<PropostasEditGestor />} />
        <Route path="/gestor/propostas/validate" element={<PropostasValidateGestor />} />
        <Route path="/gestor/propostas" element={<PropostasListGestor />} />
   
        {/* Admin */}
        <Route path="/adm/dashboard" element={<DashboardAdmin />} />
        <Route path="/adm/inicio" element={<InicioAdmin />} />
        <Route path="/adm/notifications" element={<NotifAdmin />} />
        <Route path="/adm/propostas" element={<PropostasAdmin />} />
        <Route path="/adm/propostas/add" element={<PropostasADDAdmin />} />
        <Route path="/adm/propostas/validate" element={<PropostasVALAdmin />} />
        <Route path="/adm/propostas/:id" element={<PropostasEDITAdmin />} />
        <Route path="/adm/estudantes" element={<EstudantesAdmin />} />
        <Route path="/adm/estudantes/validate" element={<EstudantesValidateAdmin />} />
        <Route path="/adm/estudantes/create" element={<EstudantesCreateAdmin />} />
        <Route path="/adm/estudantes/inativos" element={<EstudantesInativosAdmin />} />
        <Route path="/adm/utilizadores" element={<UtilizadoresAdmin />} />
        <Route path="/adm/estudantes/:id" element={<EstudantesEDITAdmin />} />
        <Route path="/adm/gestores" element={<GestoresAdmin />} />
        <Route path="/adm/gestores/:id" element={<GestoresEDITAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
