import React from 'react';
import { Switch, Route } from 'react-router-dom';

// Containers
import DashBoard from '../DashBoard';
// Components
import { PrivateRouter, PublicRouter } from '../../components/HOC/Router';
import FormLoginAndSignUp from '../../components/FormLoginAndSignUp';

function WrappRouter() {
  return (
    <Switch>
      <PrivateRouter exact path="/" />
      <PrivateRouter path="/app" component={DashBoard} />
      <PublicRouter path="/show" component={FormLoginAndSignUp} />
      <Route path="*" render={() => <h1>404 PAGE</h1>} />
    </Switch>
  );
}

export default WrappRouter;
