import React from "react";
import "../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPencilSquare,
  faTrashCan,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
{
  /*Falta pôr os dados a aparecer de forma dinamica com a BD e depois fazer a lógica do bookmarking*/
}

class CardModalDuo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  render() {
    const { imagem, empresa, areaTrabalho, ocupacao } = this.props;
    const { isValidation } = this.props;

    const {
      labelEmpresa = "Empresa",
      labelAreaTrabalho = "Área de Trabalho",
    } = this.props;

    return (
      <div className="card p-0 mb-1 mt-1 mx-auto" style={{ width: "99%" }}>
        {/* DESKTOP */}
        <div className="card-body text-center d-none d-md-block">
          <div className="d-md-flex flex-row justify-content-between align-items-center text-start">
            <div className="col-12 gap-3 d-flex flex-wrap align-items-center justify-content-between">
              <img src={imagem} width={50} alt="" />
              <div className="col-sm-12 col-md-3 flex-grow-1">
                <b className="tag-label rounded px-2 text-white">
                  {labelEmpresa}
                </b>
                <br />
                <span>{empresa}</span>
              </div>
              <div className="col-sm-12 col-md-3 flex-grow-1">
                <b className="tag-label rounded px-2 text-white">
                  {labelAreaTrabalho}
                </b>
                <br />
                <span>{areaTrabalho}</span>
              </div>
              <span className="fs-5 align-items-center">
                <FontAwesomeIcon
                  className="me-2"
                  icon={faEye}
                  data-tooltip-id="tooltip-info-1"
                  onClick={() =>
                    this.props.onViewDetails &&
                    this.props.onViewDetails({
                      imagem: this.props.imagem,
                      empresa,
                      areaTrabalho,
                      ocupacao,
                    })
                  }
                />
                {!isValidation ? (
                  <>
                    <Link to={"edit"} className="text-warning">
                      <FontAwesomeIcon
                        className="me-2"
                        icon={faPencilSquare}
                        data-tooltip-id="tooltip-info-2"
                      />
                    </Link>
                    <FontAwesomeIcon
                      className="text-danger"
                      icon={faTrashCan}
                      data-tooltip-id="tooltip-info-3"
                    />
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon
                      className="me-2"
                      icon={faCheckCircle}
                      data-tooltip-id="tooltip-info-4"
                    />
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      data-tooltip-id="tooltip-info-5"
                    />
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
        {/* MOBILE */}
        <div className="card-body text-center d-md-none">
          <div className="d-md-flex flex-row justify-content-between align-items-center text-start">
            <div className="col-12 gap-3 d-flex flex-wrap align-items-center justify-content-between">
              <div className="col-12 d-inline-flex">
                <img src={imagem} width={100} alt="" />
                <div className="col-sm-12 col-md-3">
                  <b className="tag-label rounded px-2 text-white">{labelEmpresa}</b>
                  <br />
                  <span
                    style={{ wordBreak: "break-word", whiteSpace: "normal" }}
                  >
                    {empresa}
                  </span>
                </div>
              </div>
              <div className="d-inline-flex gap-3">
                <div className="col-sm-6 col-md-3">
                  <b className="tag-label rounded px-2 text-white">
                    {labelAreaTrabalho}
                  </b>
                  <br />
                  <span>{areaTrabalho}</span>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <span className="fs-3 d-flex align-items-center me-3 gap-3 justify-content-between">
                <FontAwesomeIcon
                  icon={faEye}
                  data-tooltip-id="tooltip-info-1"
                  onClick={() =>
                    this.props.onViewDetails &&
                    this.props.onViewDetails({
                      imagem: this.props.imagem,
                      empresa,
                      areaTrabalho,
                      ocupacao,
                    })
                  }
                />
                {!isValidation ? (
                  <>
                    <Link to={"edit"} className="text-warning">
                      <FontAwesomeIcon
                        className="me-2"
                        icon={faPencilSquare}
                        data-tooltip-id="tooltip-info-2"
                      />
                    </Link>
                    <FontAwesomeIcon
                      className="text-danger"
                      icon={faTrashCan}
                      data-tooltip-id="tooltip-info-3"
                    />
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon
                      className="me-2"
                      icon={faCheckCircle}
                      data-tooltip-id="tooltip-info-4"
                    />
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      data-tooltip-id="tooltip-info-5"
                    />
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
        <ReactTooltip id="tooltip-info-1" place="left" content="Ver Proposta" />
        <ReactTooltip
          id="tooltip-info-2"
          place="left"
          content="Editar Proposta"
        />
        <ReactTooltip
          id="tooltip-info-3"
          place="left"
          content="Apagar Proposta"
        />
        <ReactTooltip
          id="tooltip-info-4"
          place="left"
          content="Aceitar Proposta"
        />
        <ReactTooltip
          id="tooltip-info-5"
          place="left"
          content="Rejeitar Proposta"
        />
      </div>
    );
  }
}

export default CardModalDuo;
