import React from 'react';
import { Switch, Route } from 'react-router-dom';
// Containers
import Setup from '../SetUp';
import Main from '../Main';
// Components
import FormLoginAndSignUp from '../../components/FormLoginAndSignUp';

function WrappRouter() {
  return (
    <Switch>
      <Route exact path="/" component={Setup} />
      <Route path="/show" component={FormLoginAndSignUp} />
      <Route path="/app" component={Main} />
      <Route path="*" render={() => <h1>404 PAGE</h1>} />
    </Switch>
  );
}

export default WrappRouter;
