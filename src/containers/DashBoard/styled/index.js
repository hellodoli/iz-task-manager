import { makeStyles } from '@material-ui/core/styles';

export const muiDashBoard = makeStyles(theme => ({
  wrapperBgDashBoard: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: theme.palette.background.paper
  },
  wrapperMainAppDashBoard: {
    width: '100%',
    minHeight: '100vh'
  },
  wrapperLeftMenuDashBoard: {
    position: 'fixed',
    width: '305px',
    height: 'calc(100% - 44px)',
    marginTop: '44px',
    paddingTop: theme.typography.pxToRem(30),
    paddingLeft: theme.typography.pxToRem(35),
    background: theme.palette.background.default,
    overflow: 'hidden'
  }
}));
