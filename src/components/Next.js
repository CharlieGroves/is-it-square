import React, { useRef, useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useHistory } from "react-router-dom";

import CardContainer from "./Container";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const auth = firebase.auth();
const firestore = firebase.firestore();

export default function Next() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const displayNameRef = useRef();
  const { updateDisplayName, currentUser } = useAuth();
  const history = useHistory();

  const handleSubmit = async (e) => {
    if (!currentUser) return history.push("/login");

    e.preventDefault();
    setError("");

    if (
      displayNameRef.current.value.replace(/\s/g, "") !==
      displayNameRef.current.value
    ) {
      setLoading(false);
      return setError("Your username must not contain spaces");
    }

    if (displayNameRef.current.value.includes("-")) {
      setLoading(false);
      return setError("Your username must not contain dashes");
    }

    try {
      setError("");
      setLoading(true);
      await updateDisplayName(displayNameRef.current.value);
      history.push("/");
    } catch {
      setError("Unable to create username");
      setLoading(false);
    }

    const { uid } = auth.currentUser;
    const userRef = firestore.collection("scores");

    await userRef.doc(uid).set({
      username: displayNameRef.current.value,
      id: uid
    });

    setLoading(false);
  }

  return (
    <CardContainer>
      <Card className="background-600 text-white">
        <Card.Body>
          <h2 className="text-center mb-4">Enter a Username</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="text">
              <Form.Label>Username</Form.Label>
              <Form.Control
                autoComplete="username"
                type="text"
                ref={displayNameRef}
                placeholder={currentUser ? currentUser.displayName : "Username"}
              />
            </Form.Group>
            <Button
              disabled={loading}
              className="w-100 btn-highlight"
              type="submit"
            >
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </CardContainer>
  );
}
