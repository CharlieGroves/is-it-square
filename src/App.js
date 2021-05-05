import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Game from "./components/Game";
import Next from "./components/Next";
import PrivateRoute from "./components/PrivateRoute";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/next" component={Next} />
          <PrivateRoute exact path="/" component={Game} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
