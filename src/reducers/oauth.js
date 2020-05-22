import { CHECK_AUTH, SIGN_OUT, SIGN_IN } from '../constants/oauth';

const INTIAL_STATE = {
  isSignedIn: null,
  user: {},
};

const oauthReducer = (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case CHECK_AUTH:
      return {
        ...state,
        isSignedIn: action.payload.isSignedIn,
        user: action.payload.user,
      };
    case SIGN_IN:
      return {
        ...state,
        isSignedIn: true,
        user: action.payload,
      };
    case SIGN_OUT:
      return {
        ...state,
        isSignedIn: false,
        user: {},
      };
    default:
      return state;
  }
};

export default oauthReducer;
