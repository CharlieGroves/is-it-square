import React, { useState, useEffect } from "react";
import { Card, Button, Table, Alert } from "react-bootstrap";
import CardContainer from "./GameContainer";
import { useAuth } from "../context/AuthContext";
import { useHistory, Link } from "react-router-dom";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import {
  useDocumentData,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import Loading from "./Loading";

const auth = firebase.auth();
const firestore = firebase.firestore();

function isSquare(n) {
  return n > 0 && Math.sqrt(n) % 1 === 0;
}

export default function Game() {
  const history = useHistory();
  const { logout } = useAuth();
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [bound, setBound] = useState(15);
  const [randomNumber, setRandomNumber] = useState(newRandom());
  const [dead, setDead] = useState(false);
  const [error, setError] = useState("");
  const { uid, displayName } = auth.currentUser;

  function newRandom(score) {
    score > 15 && setBound(score);
    console.log(bound);
    let temp = Math.floor(Math.random() * bound) ** 2;
    let rand = Math.floor(Math.random() * 100);
    if (rand >= 50) temp += Math.floor(Math.random() * 10);
    return temp;
  }

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  const LogoutButton = () => {
    return (
      <>
        <div className="w-100 text-center mt-3 mb-3">
          <Button
            varient="link"
            className="btn-highlight"
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </div>
        {error && <Alert varient="danger">{error}</Alert>}
      </>
    );
  };

  const userRef = firestore.collection("scores").doc(uid).collection("scores");
  const leaderboardRef = firestore.collection("leaderboard");

  const leaderboardQuery = leaderboardRef.orderBy("score", "desc").limit(10);
  const highscoreQuery = userRef.orderBy("score").limitToLast(1);

  let [highscore] = useCollectionData(highscoreQuery);
  let [leaderboard] = useCollectionData(leaderboardQuery);

  const reset = () => {
    setLives(3);
    return setScore(0);
  };

  const yes = () => {
    if (!isSquare(randomNumber)) {
      setRandomNumber(newRandom(score));
      return setLives(lives - 1);
    } else {
      setRandomNumber(newRandom(score));
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

  async function updateScores() {
    await userRef.add({
      score: score,
      time: firebase.firestore.FieldValue.serverTimestamp(),
    });
    await leaderboardRef.add({
      displayName: displayName,
      score: score,
      time: firebase.firestore.FieldValue.serverTimestamp(),
      id: uid,
    });
  }

  useEffect(() => {
    if (lives <= 0) {
      updateScores();
      return setDead(true);
    }
    return setDead(false);
  }, [lives, score]);

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
              <p>Highscore: {highscore && highscore[0]?.score} </p>
              <p>Lives: {lives}</p>
            </Card.Body>
            {leaderboard ? (
              <>
                <Table
                  style={{
                    minWidth: "50%",
                    maxWidth: "75%",
                    marginLeft: "5%",
                    marginRight: "5%",
                  }}
                  variant="dark"
                >
                  <thead>
                    <th>Username</th>
                    <th>Score</th>
                  </thead>
                  <tbody>
                    {leaderboard.map((foo) => (
                      <tr key={foo.id}>
                        <Link
                          style={{
                            color: "inherit",
                            textDecoration: "inherit",
                          }}
                          to={`/profile/${foo.id}`}
                        >
                          <td
                            style={{
                              color: "inherit",
                              textDecoration: "inherit",
                            }}
                            key={1}
                          >
                            {foo.displayName}
                          </td>
                        </Link>
                        <td key={2}>{foo.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            ) : (
              <Loading />
            )}
            <LogoutButton />
          </>
        ) : (
          <>
            <h1 className="mt-3">You Died!</h1>
            <h3>Score: {score}</h3>
            <Button className="btn-highlight btn mb-3" onClick={reset}>
              Play Again?
            </Button>
            <LogoutButton />
          </>
        )}
      </Card>
    </CardContainer>
  );
}
