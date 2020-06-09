import { withStyles } from '@material-ui/core/styles';

const GlobalCSS = withStyles((theme) => {
  return {
    '@global': {
      html: {
        'font-size': theme.typography.htmlFontSize,
      },
      a: {
        'text-decoration': 'none',
        'background-color': 'transparent',
      },
    },
  };
})(() => null);

export default GlobalCSS;
