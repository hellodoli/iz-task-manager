import { makeStyles } from '@material-ui/core/styles';

export const muiTabs = makeStyles((theme) => {
  return {
    indicator: {
      backgroundColor: '#75e2cf',
      boxShadow: '0 0 10px #75e2cf',
    },
  };
});

export const muiTab = makeStyles((theme) => ({
  root: {
    padding: '1rem 2rem',
    background: 'transparent',
    color: theme.palette.common.white,
  },
  selected: {
    background: theme.palette.common.white,
    color: 'inherit',
  },
  /*textColorInherit: {
    opacity: "1"
  }*/
}));

export const muiForm = makeStyles((theme) => ({
  wrapperBorderRadius: {
    borderRadius: theme.shape.borderRadius,
  },
  wrapperFixed: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  wrapperContainerParent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  wrapperContainer: {
    position: 'relative',
    width: '100%',
    minWidth: '275px',
    [theme.breakpoints.up('md')]: {
      width: '60%',
    },
  },
  wrapperHeader: {
    height: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: theme.palette.primary.main,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  },
}));
