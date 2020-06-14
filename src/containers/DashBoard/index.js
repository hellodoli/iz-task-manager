import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import { closeMenu } from '../../actions/menu';

import { muiDashBoard } from './styled';
// Components
import MenuLeft from '../../components/MenuLeftDashBoard';
import MainTask from '../../components/MainDashBoard/Task';
import Header from '../../components/Appbar';

function DashBoard(props) {
  const { isOpen, closeMenu } = props;
  const classes = muiDashBoard({ isOpen });

  return (
    <div className={classes.root}>
      <div className={classes.wrapperMainApp}>
        {/* Header */}
        <Header />
        {/* Menu Left */}
        <div>
          <div className={classes.menuOverlay} onClick={closeMenu}></div>
          <div className={classes.wrapperMenuIn}>
            <MenuLeft />
          </div>
        </div>
        {/* Dashboard */}
        <div className={classes.wrapperMain}>
          <div className={classes.innerMain}>
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

export default connect(mapStateToProps, { closeMenu })(DashBoard);
