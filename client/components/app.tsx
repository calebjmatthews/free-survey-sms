import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Header from './header';
import Home from './home';
import Results from './results';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <div className="main">
          <Header />
          <Switch>
            <Route path="/r/:surveyId">
              <Results />
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
