import { makeStyles } from '@material-ui/core/styles';

export const muiDashBoard = makeStyles((theme) => {
  const pxToRem = (n) => theme.typography.pxToRem(n);
  const overlayBgColor =
    theme.palette.type === 'dark' ? 'rgba(0,0,0,.65)' : 'rgba(0,0,0,.5)';
  return {
    root: {
      '--widthMenu': '305px',
      '--heightTopbar': '56px',
      [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
        '--heightTopbar': '48px',
      },
      [theme.breakpoints.up('sm')]: {
        '--heightTopbar': '64px',
      },
    },
    wrapperMainApp: {
      width: '100%',
      minHeight: '100vh',
    },
    menuOverlay: {
      display: 'none',
      position: 'fixed',
      top: 'var(--heightTopbar)',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: theme.zIndex.drawer - 1,
      backgroundColor: overlayBgColor,
      transition: 'opacity .25s cubic-bezier(.4,0,.2,1)',
      [theme.breakpoints.down('sm')]: {
        display: 'block',
        opacity: ({ isOpen }) => (isOpen ? 1 : 0),
        visibility: ({ isOpen }) => (isOpen ? 'visible' : 'hidden'),
      },
    },
    wrapperMenuIn: {
      position: 'fixed',
      left: ({ isOpen }) => (isOpen ? 0 : 'calc(-1*var(--widthMenu))'),
      width: 'var(--widthMenu)',
      height: 'calc(100vh - var(--heightTopbar))',
      paddingTop: pxToRem(30),
      paddingLeft: pxToRem(35),
      background: theme.palette.background.default,
      overflow: 'hidden',
      transition: 'left .25s cubic-bezier(.4,0,.2,1)',
      zIndex: theme.zIndex.drawer,
    },
    wrapperMain: {
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
    innerMain: {
      padding: `${pxToRem(20)} ${pxToRem(55)}`,
      width: '100%',
    },
  };
});
