import { THEME_DL } from '../constants/localStorage';
import { TOGGLE_DARKTHEME } from '../constants/theme';
import { defaultTheme, defaultType, getTheme } from '../theme/theme';

function json2string(type) {
  return JSON.stringify({ type });
}

function getDLTheme() {
  let dlTheme = defaultTheme;
  const ls = window.localStorage;
  const savedTheme = ls.getItem(THEME_DL);
  if (savedTheme) {
    const obSavedtheme = JSON.parse(savedTheme);
    const type = obSavedtheme.type;
    if (type) {
      const fType = type.toLowerCase();
      if (fType === 'dark' || fType === 'light') dlTheme = getTheme(fType);
    } else {
      ls.setItem(THEME_DL, json2string(defaultType));
    }
  } else {
    ls.setItem(THEME_DL, json2string(defaultType));
  }
  return dlTheme;
}

const dlThemeReducer = (state = getDLTheme(), action) => {
  switch (action.type) {
    case TOGGLE_DARKTHEME:
      const type = state.palette.type === 'light' ? 'dark' : 'light';
      window.localStorage.setItem(THEME_DL, json2string(type));
      return getTheme(type);
    default:
      return state;
  }
};

export default dlThemeReducer;
