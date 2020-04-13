import { CHECK_AUTH } from '../constants/oauth';

const INTIAL_STATE = {
  isSignedIn: null,
  user: {}
};

const oauthReducer = (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case CHECK_AUTH:
      return {
        ...state,
        isSignedIn: action.payload.isSignedIn,
        user: action.payload.user
      };
    default:
      return state;
  }
};

export default oauthReducer;
