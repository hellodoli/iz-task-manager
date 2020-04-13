import { CHECK_AUTH } from '../constants/oauth';
import { getCookie } from '../utils/cookies';
import User from '../apis/user';

export const checkAuth = () => async dispatch => {
  try {
    let user = {};
    let isSignedIn = false;
    const token = getCookie('emailToken');
    console.log('token: ', token);
    if (token !== '') {
      const userAPI = new User();
      await userAPI.getUser(token);
      if (userAPI.dataSetup && userAPI.dataSetup.email) {
        isSignedIn = true;
        user = { ...userAPI.dataSetup };
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
