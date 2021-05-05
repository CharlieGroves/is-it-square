import React, { useRef, useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { Link, useHistory } from "react-router-dom";

import CardContainer from "./Container";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      history.push("/");
    } catch (e) {
      if (
        e.message ===
        "The password is invalid or the user does not have a password."
      )
        setError("Wrong Password");
      else if (
        e.message ===
        "There is no user record corresponding to this identifier. The user may have been deleted."
      )
        setError("No user with this email");
      else setError("Unknown Error");
      setLoading(false);
    }
  }

  return (
    <CardContainer>
      <Card className="background-600 text-white">
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" required ref={emailRef} />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" required ref={passwordRef} />
            </Form.Group>
            <Button
              disabled={loading}
              className="w-100 btn-highlight"
              type="submit"
            >
              Log In
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link className="text-white" to="/forgot-password">
              Forgot Password?
            </Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link to="/signup" className="text-white">
          Need an account? Sign up
        </Link>
      </div>
    </CardContainer>
  );
}
