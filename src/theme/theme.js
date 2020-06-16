import { createMuiTheme } from '@material-ui/core/styles';

const defaultType = 'dark';
const getTheme = (type) => createMuiTheme({ palette: { type } });

const defaultTheme = getTheme(defaultType);
const darkTheme = getTheme('dark');
const lightTheme = getTheme('light');

export { defaultType, defaultTheme, darkTheme, lightTheme, getTheme };
