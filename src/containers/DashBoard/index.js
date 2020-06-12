import React from 'react';

import { connect } from 'react-redux';

import { Switch, Route } from 'react-router-dom';
import { muiDashBoard } from './styled';
// Components
import MenuLeft from '../../components/MenuLeftDashBoard';
import MainTask from '../../components/MainDashBoard/Task';
import Header from '../../components/Appbar';

function DashBoard(props) {
  const { isOpen } = props;
  const classes = muiDashBoard({ isOpen });

  return (
    <div className={classes.root}>
      <div className={classes.wrapperMainApp}>
        {/* Header */}
        <Header />
        {/* Menu Left */}
        {/* 
        <div className={classes.wrapperLeftMenuOut}>
          <div className={classes.menuLeftOverlay}></div>
        </div>  */}

        <div className={classes.wrapperLeftMenuIn}>
          <div className={classes.menuLeftOverlay}></div>
          <MenuLeft />
        </div>

        {/* Dashboard */}
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

const mapStateToProps = (state) => ({
  isOpen: state.menuReducer.isOpen,
});

export default connect(mapStateToProps)(DashBoard);
