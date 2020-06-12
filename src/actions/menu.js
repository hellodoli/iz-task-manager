import { TOGGLE_MENU, OPEN_MENU, CLOSE_MENU } from '../constants/menu';

export const toggleMenu = () => ({
  type: TOGGLE_MENU,
});

export const closeMenu = () => ({
  type: CLOSE_MENU,
});

export const openMenu = () => ({
  type: OPEN_MENU,
});
