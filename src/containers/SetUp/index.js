import React from 'react';
import { useSelector } from 'react-redux';
import Loading from '../../components/Loading';

function SetUp(props) {
  const { history } = props;
  const auth = useSelector((state) => state.oauthReducer);

  if (auth.isSignedIn === null) return <Loading fullScreen={true} />;
  if (auth.isSignedIn) history.push('/app/tasks');
  else history.push('/show');
  return null;
}

export default SetUp;
