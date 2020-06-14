import { withStyles } from '@material-ui/core/styles';

const utility = (theme) => {
  const typo = theme.typography;
  return {
    '.ml': {
      marginLeft: typo.pxToRem(10),
      [theme.breakpoints.down('xs')]: {
        marginLeft: typo.pxToRem(5),
      },
    },
    '.mr': {
      marginRight: typo.pxToRem(10),
      [theme.breakpoints.down('xs')]: {
        marginRight: typo.pxToRem(5),
      },
    },
    '.mt': {
      marginTop: typo.pxToRem(10),
      [theme.breakpoints.down('xs')]: {
        marginTop: typo.pxToRem(5),
      },
    },
    '.mb': {
      marginBottom: typo.pxToRem(10),
      [theme.breakpoints.down('xs')]: {
        marginBottom: typo.pxToRem(5),
      },
    },
    '.font-weight-bold': {
      fontWeight: 'bold',
    },
    '.font-style-italic': {
      fontStyle: 'italic',
    },
    '.text-right': {
      textAlign: 'right',
    },
    '.text-uppercase': {
      textTransform: 'uppercase',
    },
    '.text-mute': {
      opacity: '.5',
    },
    '.divider-line': {
      borderBottom: `1px solid ${theme.palette.divider}`,
      backgroundClip: 'padding-box',
    },
    '.cursor-pointer': {
      cursor: 'pointer',
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
