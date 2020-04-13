import React from 'react';
import { Switch, Route } from 'react-router-dom';

function Main() {
  return (
    <Switch>
      <Route exact path="/" render={() => <div>Main</div>} />
    </Switch>
  );
}

export default Main;
