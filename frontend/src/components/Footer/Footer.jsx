import React from "react";

// reactstrap components
import { Container, } from "reactstrap";

class Footer extends React.Component {
  render() {
    return <></>
    return (
      <footer className="footer">
        <Container fluid>
          <div className="copyright">
            © {new Date().getFullYear()} made with{" "}
            <i className="tim-icons icon-heart-2" /> by{" "}
            <a
              href="https://softtik.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Softtik Exchange
            </a>{" "}
            for a better trading experience.
          </div>
        </Container>
      </footer>
    );
  }
}

export default Footer;
