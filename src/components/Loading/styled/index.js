import { makeStyles } from '@material-ui/core/styles';

const fullScreenRootLoading = {
  position: 'fixed',
  left: 0,
  top: 0,
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const normalRootLoading = {
  display: 'inline-flex',
  width: 'auto'
};

export const muiLoading = makeStyles(theme => ({
  root: props =>
    props.fullScreen ? fullScreenRootLoading : normalRootLoading
}));
