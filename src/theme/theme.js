import { createMuiTheme } from '@material-ui/core/styles';

const defaultType = 'dark';
const theme = createMuiTheme();
const typo = theme.typography;

const getTheme = (type) =>
  createMuiTheme({
    overrides: {
      MuiCssBaseline: {
        '@global': {
          html: {
            'font-size': theme.typography.htmlFontSize,
          },
          '.ml': {
            marginLeft: `${typo.pxToRem(10)}!important`,
            [theme.breakpoints.down('xs')]: {
              marginLeft: `${typo.pxToRem(5)}!important`,
            },
          },
          '.mr': {
            marginRight: `${typo.pxToRem(10)}!important`,
            [theme.breakpoints.down('xs')]: {
              marginRight: `${typo.pxToRem(5)}!important`,
            },
          },
          '.mt': {
            marginTop: `${typo.pxToRem(10)}!important`,
            [theme.breakpoints.down('xs')]: {
              marginTop: `${typo.pxToRem(5)}!important`,
            },
          },
          '.mb': {
            marginBottom: `${typo.pxToRem(10)}!important`,
            [theme.breakpoints.down('xs')]: {
              marginBottom: `${typo.pxToRem(5)}!important`,
            },
          },
          '.font-weight-bold': {
            fontWeight: 'bold!important',
          },
          '.font-style-italic': {
            fontStyle: 'italic!important',
          },
          '.text-right': {
            textAlign: 'right!important',
          },
          '.text-uppercase': {
            textTransform: 'uppercase!important',
          },
          '.text-mute': {
            opacity: '.5!important',
          },
          '.divider-line': {
            borderBottom: `1px solid ${theme.palette.divider}!important`,
            backgroundClip: 'padding-box!important',
          },
          '.cursor-pointer': {
            cursor: 'pointer!important',
          },
        },
      },
      MuiPickersToolbarText: {
        toolbarTxt: {
          '&.MuiTypography-h3': {
            fontSize: '1.5rem',
          },
          '&.MuiTypography-h4': {
            fontSize: '1.5rem',
          },
        },
      },
      MuiGrid: {
        container: {
          '& > .MuiGrid-item': {
            flexDirection: 'row',
            alignItems: 'center',
            '& > div + div': {
              marginLeft: '10px',
            },
            '&.MuiGrid-grid-xs-6, &.MuiGrid-grid-xs-1': {
              maxWidth: '25%',
              flexBasis: '25%',
            },
            '&.MuiGrid-grid-xs-6': {
              justifyContent: 'flex-end',
            },
            '&.MuiGrid-grid-xs-1': {
              justifyContent: 'flex-start',
              marginLeft: '10px',
              '& > button + button': {
                marginLeft: '4px',
              },
            },
          },
        },
      },
      MuiPickersToolbar: {
        toolbar: { height: '64px' },
        /*toolbar: {
          [defaultTheme.breakpoints.up('sm')]: {
            height: '64px',
          },
        },*/
      },
      MuiPickersBasePicker: {
        pickerView: {
          width: '100%',
          margin: '0 auto',
          maxWidth: 'initial',
        },
      },
      MuiPickersDay: {
        /*day: {
          width: '40px',
          height: '40px'
        }*/
      },
    },
    palette: { type },
  });

const defaultTheme = getTheme(defaultType);
const darkTheme = getTheme('dark');
const lightTheme = getTheme('light');

export { defaultType, defaultTheme, darkTheme, lightTheme, getTheme };
