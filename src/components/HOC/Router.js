import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import Loading from '../../components/Loading';

/**
 * component: Component need render
 * rest: path, to, ...
 */
function PrivateRouter({ component: Component, passesProps, ...rest }) {
  const auth = useSelector((state) => state.oauthReducer);
  const isSignedIn = auth.isSignedIn;

  function RouteComponent(routerProps) {
    if (isSignedIn === null) return <Loading fullScreen={true} />;
    if (isSignedIn)
      return typeof Component === 'undefined' ? (
        <Redirect to="/app" />
      ) : (
        <Component {...passesProps} {...routerProps} />
      );
    return <Redirect to="/show" />;
  }

  return <Route {...rest} render={(props) => <RouteComponent {...props} />} />;
}

function PublicRouter({ component: Component, passesProps, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => <Component {...passesProps} {...props} />}
    />
  );
}

export { PrivateRouter, PublicRouter };
