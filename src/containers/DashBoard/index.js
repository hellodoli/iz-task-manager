import React from 'react';
import clsx from 'clsx';
import { muiDashBoard } from './styled';
import { Switch, Route } from 'react-router-dom';

// Components
import MenuLeft from '../../components/MenuLeftDashBoard';
import Task from '../../components/MainDashBoard/Task';

function DashBoard() {
  const classes = muiDashBoard();

  return (
    <div className={clsx(classes.wrapperBg, classes.root)}>
      <div className={classes.wrapperMainApp}>
        <div className={classes.wrapperLeftMenu}>
          <MenuLeft />
        </div>
        <div className={classes.wrapperRightMenu}>
          <div className={classes.innerRightMenu}>
            <Switch>
              <Route path="/app/tasks" component={Task} />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
