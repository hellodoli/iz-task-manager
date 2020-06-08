import React, { Fragment } from 'react';

import { Link } from 'react-router-dom';

import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import { Menu as MenuIcon, Home as HomeIcon } from '@material-ui/icons';

function Header() {
  return (
    <Fragment>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" color="inherit">
            <MenuIcon />
          </IconButton>

          <IconButton edge="start" color="inherit">
            <HomeIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar></Toolbar>
    </Fragment>
  );
}

export default Header;
