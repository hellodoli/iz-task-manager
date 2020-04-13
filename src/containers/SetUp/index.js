import React, { useEffect } from 'react';

import { compose } from 'redux';
import { connect } from 'react-redux';

import { withRouter, Switch, Route } from 'react-router-dom';

import { checkAuth } from '../../actions/oauth';

// Components
import Loading from '../../components/Loading';
import FormLoginAndSignUp from '../../components/FormLoginAndSignUp';
// Containers

function SetUp(props) {
  const { auth, checkAuth, history } = props;

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const renderSetUp = () => {
    if (auth.isSignedIn === null) return <Loading fullScreen={true} />;
    if (auth.isSignedIn) history.push('/app');
    else history.push('/show');
  };

  return (
    <Switch>
      <Route exact path="/" render={renderSetUp} />
      <Route path="/show" render={() => <div>Show</div>} />
      <Route path="/app" render={() => <div>App</div>} />
    </Switch>
  );
}

const mapStateToProps = state => ({
  auth: state.oauthReducer
});

export default compose(
  withRouter,
  connect(mapStateToProps, { checkAuth })
)(SetUp);
