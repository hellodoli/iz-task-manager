import { makeStyles } from '@material-ui/core/styles';

export const muiDashBoard = makeStyles((theme) => {
  const pxToRem = (n) => theme.typography.pxToRem(n);
  return {
    root: {
      '--widthMenu': '305px',
      '--heightTopbar': '44px',
    },
    wrapperMainApp: {
      width: '100%',
      minHeight: '100vh',
    },
    menuLeftOverlay: {
      display: 'none',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: theme.zIndex.drawer - 1,
      backgroundColor: 'rgba(0,0,0,.5)',
      transition: 'opacity .25s cubic-bezier(.4,0,.2,1)',
      [theme.breakpoints.down('sm')]: {
        display: 'block',
        opacity: ({ isOpen }) => (isOpen ? 1 : 0),
        visibility: ({ isOpen }) => (isOpen ? 'visible' : 'hidden'),
      },
    },
    wrapperLeftMenuOut: {
      position: 'fixed',
      left: 0,
      width: 'var(--widthMenu)',
      height: '100vh',
      pointerEvents: 'none',
    },
    wrapperLeftMenuIn: {
      position: 'fixed',
      left: ({ isOpen }) => (isOpen ? 0 : 'calc(-1*var(--widthMenu))'),
      width: 'var(--widthMenu)',
      //height: 'calc(100% - var(--heightTopbar))',
      height: '100vh',
      paddingTop: pxToRem(30),
      paddingLeft: pxToRem(35),
      background: theme.palette.background.default,
      overflow: 'hidden',
      transition: 'left .25s cubic-bezier(.4,0,.2,1)',
      zIndex: theme.zIndex.drawer,
    },
    wrapperRightMenu: {
      backgroundColor: theme.palette.background.paper,
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      position: 'relative',
      transition:
        'opacity .25s cubic-bezier(.4,0,.6,1), margin-left .25s cubic-bezier(.4,0,.2,1)',
      [theme.breakpoints.up('md')]: {
        marginLeft: ({ isOpen }) => (isOpen ? 'var(--widthMenu)' : 0),
      },
    },
    innerRightMenu: {
      padding: `${pxToRem(20)} ${pxToRem(55)}`,
      width: '100%',
    },
  };
});
