import { makeStyles } from '@material-ui/core';

export const muiAppBar = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {},
}));

export const muiMenu = makeStyles((theme) => ({
  container: {
    maxWidth: ({ kei }) => (kei ? '350px' : 'initial'),
  },
  menuItem: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
    padding: '6px 16px',
    letterSpacing: '0.00938em',
  },
  holderSpaceBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));
