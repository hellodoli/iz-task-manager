import { TOGGLE_MENU, OPEN_MENU, CLOSE_MENU } from '../constants/menu';
import { MENU_LEFT_STATUS } from '../constants/localStorage';

const json2string = (isOpen) => {
  return JSON.stringify({ isOpen });
};

const getMenuLeftStatus = () => {
  let isOpen = false;
  const ls = window.localStorage;
  const savedMenuLeftStatus = ls.getItem(MENU_LEFT_STATUS);
  if (savedMenuLeftStatus) {
    try {
      const obSavedMenuLeftStatus = JSON.parse(savedMenuLeftStatus);
      isOpen = !!obSavedMenuLeftStatus.isOpen;
    } catch (error) {
      ls.setItem(MENU_LEFT_STATUS, json2string(false));
    }
  } else {
    ls.setItem(MENU_LEFT_STATUS, json2string(false));
  }
  return { isOpen };
};

const menuReducer = (state = getMenuLeftStatus(), action) => {
  switch (action.type) {
    case TOGGLE_MENU:
      const isOpen = !state.isOpen;
      window.localStorage.setItem(MENU_LEFT_STATUS, json2string(isOpen));
      return { ...state, isOpen };
    case CLOSE_MENU:
      window.localStorage.setItem(MENU_LEFT_STATUS, json2string(false));
      return { ...state, isOpen: false };
    case OPEN_MENU:
      window.localStorage.setItem(MENU_LEFT_STATUS, json2string(true));
      return { ...state, isOpen: true };
    default:
      return state;
  }
};

export default menuReducer;
