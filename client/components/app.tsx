import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Header from './header';
import Home from './home';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <div className="main">
          <Header />
          <Switch>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  )
}
