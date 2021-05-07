import React, { useState, useEffect } from "react";
import { Card, Button, CardDeck } from "react-bootstrap";
import CardContainer from "./Container";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";

const auth = firebase.auth();
const firestore = firebase.firestore();

function newRandom() {
  let temp = Math.floor(Math.random() * 15) ** 2;
  let rand = Math.floor(Math.random() * 100);
  if (rand >= 50) {
    temp += Math.floor(Math.random() * 10);
    console.log("yes");
  } else {
    console.log("no");
  }
  return temp;
}

function isSquare(n) {
  return n > 0 && Math.sqrt(n) % 1 === 0;
}

export default function Game() {
  const [score, setScore] = useState(0);
  const [randomNumber, setRandomNumber] = useState(newRandom());
  const [lives, setLives] = useState(3);
  const [dead, setDead] = useState(false);
  const { uid, email, displayName } = auth.currentUser;
  const userRef = firestore.collection("scores").doc(uid);

  let [user] = useDocumentData(userRef);
  let scores = user?.score;
  
  console.log(uid);
  console.log(user, user?.score);
  console.log(Math.max(user?.score));

  const reset = () => {
    setLives(3);
    return setScore(0);
  }

  const yes = () => {
    if (!isSquare(randomNumber)) {
      setRandomNumber(newRandom());
      return setLives(lives - 1);
    } else {
      setRandomNumber(newRandom());
      return setScore(score + 1);
    }
  };

  const no = () => {
    if (isSquare(randomNumber)) {
      setRandomNumber(newRandom());
      return setLives(lives - 1);
    } else {
      setRandomNumber(newRandom());
      return setScore(score + 1);
    }
  };

  useEffect(async () => {
    if (lives === 0) {
      scores.push(score);
      await userRef.update({
        score: scores,
      });
      return setDead(true);
    }
    return setDead(false);
  }, [lives]);

  return (
    <CardContainer>
      <Card className="background-600 text-white text-center align-items-center">
        {!dead ? (
          <>
            <h1>Is it square?</h1>
            <h2>{randomNumber}</h2>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              className="yes-no-container w-100"
            >
              <Button
                style={{ fontSize: "3rem" }}
                className="btn btn-highlight"
                onClick={yes}
                disabled={dead}
              >
                Yes
              </Button>
              <Button
                style={{ fontSize: "3rem" }}
                className="btn btn-highlight ml-5"
                onClick={no}
                disabled={dead}
              >
                No
              </Button>
            </div>
            <Card.Body>
              <p>Score: {score}</p>
              <p>Highscore: {user && user.score && Math.max(...user?.score)} </p>
              <p>Lives: {lives}</p>
            </Card.Body>
          </>
        ) : (
          <>
            <h1 className="mt-3">You Died!</h1>
            <h3>Score: {score}</h3>
            <Button className="btn-highlight btn mb-3" onClick={reset}>
              Play Again?
            </Button>
          </>
        )}
      </Card>
    </CardContainer>
  );
}
