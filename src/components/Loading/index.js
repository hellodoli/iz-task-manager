import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { muiLoading } from './styled';

function Loading(props) {
  const { fullScreen, showBg, color, ...other } = props;
  const classes = muiLoading(props);
  return (
    <div className={classes.root}>
      <CircularProgress color={color || 'secondary'} {...other} />
    </div>
  );
}

export default Loading;
