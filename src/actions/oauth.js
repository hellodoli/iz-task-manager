import { CHECK_AUTH } from '../constants/oauth';
import { getCookie } from '../utils/cookies';
import User from '../apis/user';

export const checkAuth = () => async dispatch => {
  try {
    let user = {};
    let isSignedIn = false;
    const token = getCookie('emailToken');
    console.log(token);
    if (token !== '') {
      const user = new User();
      await user.getUser(token);
      if (user.dataSetup && user.dataSetup.email) {
        isSignedIn = true;
        user = { ...user.dataSetup };
      }
    }
    dispatch({
      type: CHECK_AUTH,
      payload: { isSignedIn, user }
    });
  } catch (error) {
    console.log(error);
  }
};