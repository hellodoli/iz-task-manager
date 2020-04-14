import React, { useEffect } from 'react';

import { connect } from 'react-redux';

import { useHistory } from 'react-router-dom';

// Components
import Loading from '../../components/Loading';
// Containers
import DashBoard from '../DashBoard';

function Main(props) {
  const { auth } = props;
  const history = useHistory();

  useEffect(() => {
    if (auth.isSignedIn === false) history.push('/show');
  }, [auth.isSignedIn, history]);

  if (auth.isSignedIn === null) return <Loading fullScreen={true} />;
  if (auth.isSignedIn) return <DashBoard />;
}

const mapStateToProps = state => ({
  auth: state.oauthReducer
});

export default connect(mapStateToProps)(Main);
