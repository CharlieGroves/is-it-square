import React, { useRef, useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { Link, useHistory } from "react-router-dom";
import CardContainer from "./Container";
import '../App.css'

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setLoading(true);
 
    const password = passwordRef.current.value;
    const confirmPassword = passwordConfirmRef.current.value;

    if (password.length < 8) {
      setLoading(false);
      return setError("Password too short");
    }

    if (password === confirmPassword) {
      try {
        setError("");
        setLoading(true);
        await signup(emailRef.current.value, passwordRef.current.value);
        history.push("/next");
      } catch (e) {
        setLoading(false);
        if (
          e.message ===
          "The email address is already in use by another account."
        )
          return setError(
            "The email address is already in use by another account."
          );
      }
    }
  }

  return (
    <CardContainer>
      <Card className="background-600 text-white">
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                autoComplete="new-password"
                type="email"
                required
                ref={emailRef}
              />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                autoComplete="new-password"
                type="password"
                required
                ref={passwordRef}
              />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                autoComplete="new-password"
                type="password"
                required
                ref={passwordConfirmRef}
              />
            </Form.Group>
            <Button
              disabled={loading}
              className="w-100 btn-highlight"
              type="submit"
            >
              Next
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link className="text-white" to="/login">
          Already have an account? Log In
        </Link>
      </div>
    </CardContainer>
  );
}
