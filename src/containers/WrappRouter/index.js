import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
// Containers
import Main from '../Main';
// Components
import Loading from '../../components/Loading';
import FormLoginAndSignUp from '../../components/FormLoginAndSignUp';

function RedirectRouter({ ...rest }) {
  const auth = useSelector((state) => state.oauthReducer);

  function RouteComponent() {
    if (auth.isSignedIn === null) return <Loading fullScreen={true} />;
    if (auth.isSignedIn) return <Redirect to="/app" />;
    return <Redirect to="/show" />;
  }

  return <Route {...rest} render={() => <RouteComponent />} />;
}

function WrappRouter() {
  return (
    <Switch>
      <RedirectRouter exact path="/" />
      <Route path="/show" component={FormLoginAndSignUp} />
      <Route path="/app" component={Main} />
      <Route path="*" render={() => <h1>404 PAGE</h1>} />
    </Switch>
  );
}

export default WrappRouter;
