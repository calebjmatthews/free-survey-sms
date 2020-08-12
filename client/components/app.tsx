import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Header from './header';
import Home from './home';
import Login from './login';
import Results from './results';
import MessageResults from './message_results';

import FASetup from '../models/fa_setup';

export default function App() {
  let faSetup = new FASetup();
  return (
    <BrowserRouter>
      <div className="app">
        <div className="main">
          <Header />
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/r/:surveyId">
              <Results />
            </Route>
            <Route path="/messages/:surveyId">
              <MessageResults />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  )
}
