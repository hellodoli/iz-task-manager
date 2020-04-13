import { withStyles } from '@material-ui/core/styles';

const GlobalCSS = withStyles(theme => {
  return {
    '@global': {
      html: {
        'font-size': theme.typography.htmlFontSize
      },
      body: {
        ...theme.typography.body1,
        padding: 0,
        margin: 0
      },
      h1: theme.typography.h1,
      h2: theme.typography.h2,
      h3: theme.typography.h3,
      h4: theme.typography.h4,
      h5: theme.typography.h5,
      h6: theme.typography.h6
    }
  };
})(() => null);

export default GlobalCSS;
