import { withStyles } from '@material-ui/core/styles';

const GlobalCSS = withStyles((theme) => {
  return {
    '@global': {
      html: {
        'font-size': theme.typography.htmlFontSize,
      },
    },
  };
})(() => null);

export default GlobalCSS;
