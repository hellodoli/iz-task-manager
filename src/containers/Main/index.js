import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

// Components
import Loading from '../../components/Loading';
// Containers
import DashBoard from '../DashBoard';

function Main(props) {
  const { auth } = props;
  if (auth.isSignedIn === null) return <Loading fullScreen={true} />;
  if (auth.isSignedIn) return <DashBoard />;
  return <Redirect to="/show" />;
}

Main.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.oauthReducer,
});

export default connect(mapStateToProps)(Main);
