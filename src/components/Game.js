import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import CardContainer from "./Container";

export default function Game() {
  const [score, setScore] = useState(0);
  const [randomNumber, setRandomNumber] = useState(
    Math.floor(Math.random() * 10)
  );

  const yes = () => {
    setRandomNumber(Math.floor(Math.random() * (score + 2)));
    return setScore(score + 1);
  };

  const no = () => {
    setRandomNumber(Math.floor(Math.random() * (score + 2)));
    return setScore(score + 1);
  };

  return (
    <CardContainer>
      <Card className="background-600 text-white text-center align-items-center">
        <h1>Is it square?</h1>
        <h2>{randomNumber}</h2>
        <div className="yes-no-container w-100">
          <Button className="btn btn-highlight" onClick={yes}>
            Yes
          </Button>
          <Button className="btn btn-highlight ml-2" onClick={no}>
            No
          </Button>
        </div>
        <Card.Body>Score: {score}</Card.Body>
      </Card>
    </CardContainer>
  );
}
