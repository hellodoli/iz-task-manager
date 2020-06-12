import React, { Fragment } from 'react';

import { connect } from 'react-redux';
import { toggleMenu } from '../../actions/menu';

import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import { Menu as MenuIcon, Home as HomeIcon } from '@material-ui/icons';

function Header(props) {
  const { isOpen, toggleMenu } = props;

  return (
    <Fragment>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleMenu}>
            <MenuIcon />
          </IconButton>

          <IconButton edge="start" color="inherit">
            <HomeIcon />
          </IconButton>

          {`isOpen: ${isOpen.toString()}`}
        </Toolbar>
      </AppBar>
      <Toolbar></Toolbar>
    </Fragment>
  );
}

const mapStateToProps = (state) => ({
  isOpen: state.menuReducer.isOpen,
});

export default connect(mapStateToProps, { toggleMenu })(Header);
