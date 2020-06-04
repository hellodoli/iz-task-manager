import React from 'react';

import { Switch, Route } from 'react-router-dom';
import { muiDashBoard } from './styled';
// Components
import MenuLeft from '../../components/MenuLeftDashBoard';
import MainTask from '../../components/MainDashBoard/Task';
import Header from '../../components/Appbar';

function DashBoard() {
  const classes = muiDashBoard();

  return (
    <div className={classes.root}>
      <div className={classes.wrapperMainApp}>
        <Header />
        <div className={classes.wrapperLeftMenu}>
          <MenuLeft />
        </div>
        <div className={classes.wrapperRightMenu}>
          <div className={classes.innerRightMenu}>
            <Switch>
              <Route path="/app/tasks" component={MainTask} />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
