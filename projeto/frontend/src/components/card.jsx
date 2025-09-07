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
      isBookmarked: !!props.isBookmarked,
      isOpen: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isBookmarked !== this.props.isBookmarked) {
      // Keep internal icon state in sync with parent-controlled favorite state
      // without forcing a re-render loop.
      // Only update when prop actually changes.
      // This allows the icon to reflect persisted favorites.
      //
      // Note: we avoid setState if equal to prevent extra renders.
      if (this.state.isBookmarked !== !!this.props.isBookmarked) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ isBookmarked: !!this.props.isBookmarked });
      }
    }
  }

  toggleBookmark = () => {
    const { empresa, localizacao, dataSubmissao, categoria, vaga } = this.props;
    const payload = {
      empresa,
      localizacao,
      dataSubmissao,
      categoria,
      vaga,
      imagem: this.props.imagem,
      idproposta: this.props.idproposta,
      raw: this.props.rawData,
    };

    if (this.props.onToggleFavorite) {
      this.props.onToggleFavorite(payload);
    }

    this.setState((prevState) => ({ isBookmarked: !prevState.isBookmarked }));
  };

  toggleDetails = () => {
    this.setState((prevState) => ({
      isOpen: !prevState.isOpen,
    }));
  };

  render() {
    const { isBookmarked, isOpen } = this.state;
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
