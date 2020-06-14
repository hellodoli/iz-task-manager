import { TOGGLE_MENU, OPEN_MENU, CLOSE_MENU } from '../constants/menu';

const initial = { isOpen: false };
const menuReducer = (state = initial, action) => {
  switch (action.type) {
    case TOGGLE_MENU:
      return { ...state, isOpen: !state.isOpen };
    case CLOSE_MENU:
      return { ...state, isOpen: false };
    case OPEN_MENU:
      return { ...state, isOpen: true };
    default:
      return state;
  }
};

export default menuReducer;
