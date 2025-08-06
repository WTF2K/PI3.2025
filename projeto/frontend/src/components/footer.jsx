import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

class Footer extends React.Component {
  render() {
    return (
      <footer
        className="footer text-center text-white mt-auto p-3"
        style={{ backgroundColor: "#314B66" }}
      >
        © Pixel & Frame - {new Date().getFullYear()}. All rights reserved
      </footer>
    );
  }
}

export default Footer;
