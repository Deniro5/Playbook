import React from "react";
import "./scss/App.scss";
import { Home } from "./components/Home";
import Error from "./components/Error";
import { Formation } from "./components/Formation";
import { PlaybookProvider } from "./components/PlaybookContext";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <div className='App'>
      <Router>
        <Switch>
          <Route exact path='/:playbookid'>
            <PlaybookProvider>
              <Formation />
            </PlaybookProvider>
          </Route>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route path='*'>
            <Error />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
