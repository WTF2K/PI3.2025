import React from "react";
import "../custom.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faBookmark,
  faMapMarker,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkOutline } from "@fortawesome/free-regular-svg-icons";
{
  /*Falta pôr os dados a aparecer de forma dinamica com a BD e depois fazer a lógica do bookmarking*/
}

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBookmarked: false,
      isOpen: false,
    };
  }

  toggleBookmark = () => {
    if (this.props.onToggleFavorite) {
      const { empresa, localizacao, dataSubmissao, categoria, vaga } = this.props;
      this.props.onToggleFavorite({
        empresa,
        localizacao,
        dataSubmissao,
        categoria,
        vaga,
        imagem: this.props.imagem,
        raw: this.props.rawData || null,
      });
      return;
    }
    this.setState((prevState) => ({ isBookmarked: !prevState.isBookmarked }));
  };

  toggleDetails = () => {
    this.setState((prevState) => ({
      isOpen: !prevState.isOpen,
    }));
  };

  render() {
    const stateIsBookmarked = this.state.isBookmarked;
    const isOpen = this.state.isOpen;
    const isBookmarked =
      typeof this.props.isBookmarked === "boolean"
        ? this.props.isBookmarked
        : stateIsBookmarked;
    const { empresa, localizacao, dataSubmissao, categoria, vaga } = this.props;

    if (!isOpen) {
      return (
        <div className="card p-0 ">
          <div className="card-body text-center">
            <div className="d-md-flex flex-row justify-content-between align-items-center text-start">
              <div className="col-7">
                <img src={this.props.imagem} alt="" className="w-50" />
              </div>
              <div className="col-5">
                <h5 className="card-title">{empresa}</h5>
              </div>
            </div>
            <hr />
            <div className="card-text text-start mb-3">
              <div className="mb-2 fs-5 d-md-flex flex-row justify-content-between align-items-center">
                <div className="col-6">
                  <FontAwesomeIcon icon={faCalendar} />
                  <span className="ms-2">{dataSubmissao}</span>
                </div>
                <div className="col-6">
                  <FontAwesomeIcon icon={faMapMarker} />
                  <span className="ms-2">{localizacao}</span>
                </div>
              </div>
              <div className="mb-2 d-md-flex flex-row justify-content-between align-items-center">
                <div className="col-12">
                  <b className="tag-label rounded px-2 text-white">
                    Área de trabalho
                  </b>
                  <br />
                  <span>{categoria}</span>
                </div>
              </div>
              <div className="mb-2 d-md-flex flex-row justify-content-between align-items-center">
                <div className="col-12">
                  <b className="tag-label rounded px-2 text-white">Ocupação</b>
                  <br />
                  <span>{vaga}</span>
                </div>
              </div>
            </div>
            <div className="d-md-flex flex-row justify-content-center align-items-center">
              <button
                type="submit"
                className="btn btn-light mb-1 me-3"
                onClick={() =>
                  this.props.onViewDetails &&
                  this.props.onViewDetails({
                    empresa,
                    localizacao,
                    dataSubmissao,
                    categoria,
                    vaga,
                    imagem: this.props.imagem,
                  })
                }
                style={{ fontWeight: "600" }}
              >
                Ver Proposta
              </button>

              <FontAwesomeIcon
                icon={isBookmarked ? faBookmark : faBookmarkOutline}
                className="fs-3"
                onClick={this.toggleBookmark}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Card;
