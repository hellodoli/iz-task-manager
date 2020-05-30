import { withStyles } from '@material-ui/core/styles';

const GlobalCSS = withStyles((theme) => {
  return {
    '@global': {
      html: {
        'font-size': theme.typography.htmlFontSize,
      },
      body: {
        ...theme.typography.body1,
        padding: 0,
        margin: 0,
      },
    },
  };
})(() => null);

export default GlobalCSS;
