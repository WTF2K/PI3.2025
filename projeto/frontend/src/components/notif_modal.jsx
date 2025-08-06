import React from "react";
import "../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Tooltip as ReactTooltip } from "react-tooltip";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinusCircle,
  faEye,
  faFolderClosed,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
{
  /*Falta pôr os dados a aparecer de forma dinamica com a BD e depois fazer a lógica do bookmarking*/
}

class NotifModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

   toggleDetails = () => {
    this.setState((prevState) => ({
      isOpen: !prevState.isOpen,
    }));
  };

  render() {
    const { isOpen } = this.state;
    const {
      mensagem,
      utilizador,
      competencias,
      areaInteresse,
      proposta,
      areaTrabalho,
      ocupacao,
    } = this.props;

    return (
      <div className="card p-0 mx-auto mb-1 mt-1" style={{ width: "99%" }}>
        <div className="card-body text-center">
          <div className="d-md-flex flex-row justify-content-between align-items-center text-start">
            <div className="col-12 d-inline-flex gap-3 justify-content-between">
              <h5 className="card-title">{mensagem}</h5>
              <span className="fs-5 d-flex align-items-center me-3 gap-3">
                {!isOpen ? (
                    <FontAwesomeIcon icon={faFolderClosed} data-tooltip-id="tooltip-info-3" onClick={()=>{this.toggleDetails()}} />
                ) : (
                  <FontAwesomeIcon icon={faFolderOpen}  onClick={()=>{this.toggleDetails()}} />
                )}
              </span>
            </div>
          </div>
          {isOpen ? (
            <>
              <hr />
              <div className="card-text text-start mb-3">
                <div className="mb-2 d-md-flex flex-row justify-content-between align-items-center">
                  <div className="col-sm-12 col-md-3">
                    <b className="tag-label rounded px-2 text-white">
                      Utilizador
                    </b>
                    <br />
                    <span>{utilizador}</span>
                  </div>
                  <div className="col-sm-12 col-md-3">
                    <b className="tag-label rounded px-2 text-white">
                      Competências e soft skills
                    </b>
                    <br />
                    <span>{competencias}</span>
                  </div>
                  <div className="col-sm-12 col-md-3">
                    <b className="tag-label rounded px-2 text-white">
                      Área de interesse pessoal
                    </b>
                    <br />
                    <span>{areaInteresse}</span>
                  </div>
                  <div className="d-none d-md-block d-sm-none col-sm-12 col-md-3 fs-5 row gap-3">
                    <FontAwesomeIcon icon={faEye} data-tooltip-id="tooltip-info-2"/>
                  </div>
                  <button
                    type="submit"
                    className="d-sm-block d-md-none btn btn-light mb-1 mt-3"
                    style={{ fontWeight: "600" }}
                  >
                    Ver Utilizador
                  </button>
                </div>
              </div>
              <hr />
              <div className="card-text text-start mb-3">
                <div className="mb-2 d-md-flex flex-row justify-content-between align-items-center">
                  <div className="col-sm-12 col-md-3">
                    <b className="tag-label rounded px-2 text-white">
                      Proposta
                    </b>
                    <br />
                    <span>{proposta}</span>
                  </div>
                  <div className="col-sm-12 col-md-3">
                    <b className="tag-label rounded px-2 text-white">
                      Área de trabalho
                    </b>
                    <br />
                    <span>{areaTrabalho}</span>
                  </div>
                  <div className="col-sm-12 col-md-3">
                    <b className="tag-label rounded px-2 text-white">
                      Ocupação
                    </b>
                    <br />
                    <span>{ocupacao}</span>
                  </div>
                  <div className="d-none d-md-block d-sm-none col-sm-12 col-md-3 fs-5 row gap-3">
                    <FontAwesomeIcon icon={faEye} data-tooltip-id="tooltip-info-1" onClick={() => this.props.onViewDetails?.()}/>
                    <FontAwesomeIcon icon={faMinusCircle} className="text-danger" data-tooltip-id="tooltip-apagar-1"/>
                  </div>
                  <div className="d-md-none d-sm-inline-block fs-1 d-flex me-3 gap-3 mt-3 d-flex justify-content-between">
                <FontAwesomeIcon icon={faEye} data-tooltip-id="tooltip-info-1" onClick={() => this.props.onViewDetails?.()}/>
                <FontAwesomeIcon icon={faMinusCircle} className="text-danger" data-tooltip-id="tooltip-apagar-1"/>
              </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
        <ReactTooltip
        id="tooltip-apagar-1"
        place="bottom"
        content="Apagar Notificação"
      />
      <ReactTooltip
        id="tooltip-info-1"
        place="top"
        content="Ver Proposta"
      />
      <ReactTooltip
        id="tooltip-info-2"
        place="top"
        content="Ver Utilizador"
      />
      <ReactTooltip
        id="tooltip-info-3"
        place="top"
        content="Abrir Detalhes"
      />
      </div>
    );
  }
}

export default NotifModal;
