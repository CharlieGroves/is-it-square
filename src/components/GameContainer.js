import React from "react";
import { Container } from "react-bootstrap";

const CardContainer = ({ children }) => {
  return (
    <Container
      className="d-flex w-100 align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="w-100"
        style={{
          maxWidth: "1600px",
          maxHeight: "95vh",
          marginTop: "auto",
          marginBottom: "auto",
        }}
      >
        {children}
      </div>
    </Container>
  );
};

export default CardContainer;
