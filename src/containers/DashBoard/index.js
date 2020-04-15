import React from 'react';

import { muiDashBoard } from './styled';

import MainApp from './MainApp';

function DashBoard() {
  const classes = muiDashBoard();

  return (
    <div className={classes.wrapperBgDashBoard}>
      <MainApp />
    </div>
  );
}

export default DashBoard;
