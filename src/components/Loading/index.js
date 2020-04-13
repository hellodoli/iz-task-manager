import React from 'react';

import { muiLoading } from './styled';
import CircularProgress from '@material-ui/core/CircularProgress';

function Loading(props) {
  const classes = muiLoading(props);
  return (
    <div className={classes.root}>
      <CircularProgress size={props.size} />
    </div>
  );
}

export default Loading;
