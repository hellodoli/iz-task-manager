import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { showLoading, hideLoading } from '../actions/loading';

function useSetup(isSignedIn) {
  const history = useHistory();
  const dispatch = useDispatch();

  const showL = () => dispatch(showLoading());
  const hideL = () => dispatch(hideLoading());

  if (isSignedIn === null) {
    showL();
  } else if (isSignedIn) {
    hideL();
    history.push('/app/tasks');
  } else {
    hideL();
    history.push('/show');
  }
  return null;
}

export { useSetup };
