import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginPage from './LoginPage';
import PetForm from './PetForm';
import Results from './Results';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={LoginPage} />
          <Route path="/PetForm" component={PetForm} />
          <Route path="/Results" component={Results} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
