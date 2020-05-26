import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

function SetUp(props) {
  const { isSignedIn, history } = props;
  useEffect(() => {
    if (isSignedIn) history.push('/app');
    else history.push('/show');
  }, [history, isSignedIn]);
  return null;
}

SetUp.propTypes = {
  isSignedIn: PropTypes.bool.isRequired
};

export default withRouter(SetUp);
