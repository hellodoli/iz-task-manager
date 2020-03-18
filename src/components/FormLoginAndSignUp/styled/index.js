import { makeStyles } from '@material-ui/core/styles';

export const muiTabs = makeStyles(theme => {
  window.theme = theme;
  console.log('theme: ', theme);
  return {
    indicator: {
      backgroundColor: '#75e2cf',
      boxShadow: '0 0 10px #75e2cf'
    }
  };
});

export const muiTab = makeStyles(theme => ({
  root: {
    padding: '18px 36px',
    background: 'transparent',
    color: theme.palette.common.white
  },
  selected: {
    background: theme.palette.common.white,
    color: 'inherit'
  }
  /*textColorInherit: {
    opacity: "1"
  }*/
}));

export const muiForm = makeStyles(theme => ({
  wrapperFixed: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  },
  wrapperContainer: {
    position: 'relative',
    width: '35%',
    minWidth: '275px'
  },
  wrapperHeader: {
    height: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: theme.palette.primary.main
  },
  margin: {
    margin: theme.spacing(1)
  }
}));
