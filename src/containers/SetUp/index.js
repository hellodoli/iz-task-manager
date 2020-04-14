import { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

function SetUp(props) {
  const { isSignedIn, history } = props;
  useEffect(() => {
    if (isSignedIn) history.push('/app');
    else history.push('/show');
  }, [history, isSignedIn]);
  return null;
}

export default withRouter(SetUp);
