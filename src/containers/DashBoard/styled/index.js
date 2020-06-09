import { makeStyles } from '@material-ui/core/styles';

export const muiDashBoard = makeStyles((theme) => ({
  root: {
    '--widthMenu': '305px',
    '--heightTopbar': '44px',
  },
  wrapperMainApp: {
    width: '100%',
    minHeight: '100vh',
  },
  wrapperLeftMenu: {
    position: 'fixed',
    width: 'var(--widthMenu)',
    //height: 'calc(100% - var(--heightTopbar))',
    paddingTop: theme.typography.pxToRem(30),
    paddingLeft: theme.typography.pxToRem(35),
    background: theme.palette.background.default,
    overflow: 'hidden',
    transition: 'left .25s cubic-bezier(.4,0,.2,1)',
  },
  wrapperRightMenu: {
    backgroundColor: theme.palette.background.paper,
    marginLeft: 'var(--widthMenu)',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    transition:
      'opacity .25s cubic-bezier(.4,0,.6,1), margin-left .25s cubic-bezier(.4,0,.2,1)',
  },
  innerRightMenu: {
    padding: `${theme.typography.pxToRem(20)} ${theme.typography.pxToRem(55)}`,
    width: '100%',
  },
}));
