import React from 'react';

import { muiDashBoard } from './styled';

// Components
import MenuLeft from './MenuLeft';

function MainApp() {
  const classes = muiDashBoard();

  return (
    <div className={classes.wrapperMainAppDashBoard}>
      <div className={classes.wrapperLeftMenuDashBoard}>
        <MenuLeft />
      </div>
      <div>Content Right</div>
    </div>
  );
}

export default MainApp;
