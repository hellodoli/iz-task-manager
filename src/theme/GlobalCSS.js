import { withStyles } from '@material-ui/core/styles';

const utility = (theme) => {
  const typo = theme.typography;
  return {
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
  };
};

const GlobalCSS = withStyles((theme) => {
  return {
    '@global': {
      html: {
        'font-size': theme.typography.htmlFontSize,
      },
      ...utility(theme),
    },
  };
})(() => null);

export default GlobalCSS;
