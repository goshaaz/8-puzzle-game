import './App.css';
import React, {useState, useEffect} from "react"
import {BrowserRouter as Router, Route, Redirect, Link, Switch} from 'react-router-dom'
import SignIn from './pages/SignInScreen'
import Main from './pages/Main.js'
import { AuthProvider } from "./Context/firebaseContext";

function App() {

  return (
    <AuthProvider>
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <SignIn/>
          </Route>
          <Route path="/app">
            <Main/>
          </Route>
        </Switch>
        <footer className="footer">
          Developed by Georgij Li
        </footer>
      </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
