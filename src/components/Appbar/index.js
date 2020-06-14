import React, { Fragment, useState } from 'react';
import clxs from 'clsx';
import { connect } from 'react-redux';

import { toggleMenu as toggleMenuLeft } from '../../actions/menu';

import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Switch,
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Brightness4 as Brightness4Icon,
  Palette as PaletteIcon,
  ChevronRight as ChevronRightIcon,
  ArrowBack as ArrowBackIcon,
} from '@material-ui/icons';

import { muiAppBar, muiMenu } from './styled';

function LevelMenu(props) {
  if (props.based) return <LevelOneBasedMenu {...props} />;
  return <LevelOneMenu {...props} />;
}

function LevelOneMenu({
  kei,
  menuId,
  title,
  items,
  isShowVersionItem,

  anchorEl,
  handleClose,
  handleOpen,
}) {
  const handleOpenBasedMenu = (anchorEl, ctrKey) => {
    if (ctrKey) {
      const cloneAnchorEl = anchorEl;
      handleOpen(cloneAnchorEl, ctrKey);
    }
  };

  return (
    <Menu
      id={menuId}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => handleClose(kei)}
    >
      <MenuItem disabled={true} divider={true}>
        {title}
      </MenuItem>

      {items.map(({ id, icon, text, control }, index) => (
        <MenuItem
          key={id}
          divider={index === items.length - 1}
          onClick={() => handleOpenBasedMenu(anchorEl, control)}
        >
          {icon && icon.start}
          <span className={'ml mr'}>{text}</span>
          {icon && icon.end}
        </MenuItem>
      ))}

      {isShowVersionItem && (
        <MenuItem disabled={true}>
          <small>Version 0.0.1</small>
        </MenuItem>
      )}
    </Menu>
  );
}

function ContentDarkThemeMenu(props) {
  const { kei, anchorEl, based, title, handleClose, handleOpen } = props;
  const classes = muiMenu();
  const classesMenu = (kei) => muiMenu({ kei });

  const handleBack = () => {
    handleClose(kei);
    handleOpen(anchorEl, based);
  };

  return (
    <div>
      <div className={clxs(classes.menuItem, 'divider-line')}>
        <IconButton
          edge="start"
          size="small"
          color="inherit"
          onClick={handleBack}
        >
          <ArrowBackIcon />
        </IconButton>
        <span className={'ml'}>{title}</span>
      </div>

      <div className={classesMenu(kei).container}>
        <div className={classes.menuItem}>
          <div className={'mb'}>
            Dark theme turns the light surfaces of the page dark, creating an
            experience ideal for night. Try it out!
          </div>
          <div>Your Dark theme setting will apply to this browser only.</div>
        </div>
        <div className={classes.menuItem}>
          <div className={classes.holderSpaceBetween}>
            <span className={'text-uppercase text-mute'}>DARK THEME</span>
            <span>
              <Switch color="primary" checked={true} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LevelOneBasedMenu(props) {
  const { kei, menuId, anchorEl, handleClose } = props;
  return (
    <Menu
      id={menuId}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => handleClose(kei)}
    >
      {kei === 'darktheme' ? <ContentDarkThemeMenu {...props} /> : null}
    </Menu>
  );
}

function Header(props) {
  const { toggleMenuLeft } = props;
  const classes = muiAppBar();

  const [menu, setMenu] = useState({
    setting: {
      kei: 'setting',
      menuId: 'iz-appbar-setting-menu',
      title: 'Setting',
      anchorEl: null,
      items: [
        {
          id: 'setting-00',
          control: 'darktheme', // point to kei based menu
          icon: {
            start: <Brightness4Icon />,
            end: <ChevronRightIcon />,
          },
          text: 'Dark theme : ON',
        },
        {
          id: 'setting-01',
          icon: {
            start: <PaletteIcon />,
            end: null,
          },
          text: 'Theme',
        },
      ],
    },
    profile: {
      kei: 'profile',
      menuId: 'iz-appbar-profile-menu',
      title: 'Profile',
      anchorEl: null,
      items: [],
    },
    // based
    darktheme: {
      kei: 'darktheme',
      based: 'setting',
      menuId: 'iz-appbar-setting-menu-darktheme',
      title: 'Darktheme',
      anchorEl: null,
    },
  });

  function getResetAnchorEl() {
    const cloneMenu = { ...menu };
    const keys = Object.keys(cloneMenu);
    keys.forEach((key) => (cloneMenu[key].anchorEl = null));
    return cloneMenu;
  }

  const handleMenuOpen = (e, menuKey) => {
    const cloneMenu = getResetAnchorEl();
    const anchorEl = e && e.tagName ? e : e.currentTarget;
    cloneMenu[menuKey].anchorEl = anchorEl;
    setMenu(cloneMenu);
  };

  const handleMenuClose = (menuKey) => {
    const cloneMenu = { ...menu };
    cloneMenu[menuKey].anchorEl = null;
    setMenu(cloneMenu);
  };

  return (
    <Fragment>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleMenuLeft}>
            <MenuIcon />
          </IconButton>
          <IconButton edge="start" color="inherit">
            <HomeIcon />
          </IconButton>

          <div className={classes.grow}></div>
          <div className={classes.sectionDesktop}>
            <IconButton
              edge="end"
              color="inherit"
              onClick={(e) => handleMenuOpen(e, menu.profile.kei)}
            >
              <AccountCircleIcon />
            </IconButton>
            <IconButton
              edge="end"
              color="inherit"
              onClick={(e) => handleMenuOpen(e, menu.setting.kei)}
            >
              <SettingsIcon />
            </IconButton>
          </div>
          {/* Level 1 Menu */}
          <LevelMenu
            {...menu.setting}
            handleOpen={handleMenuOpen}
            handleClose={handleMenuClose}
            isShowVersionItem={true}
          />
          <LevelMenu
            {...menu.profile}
            handleOpen={handleMenuOpen}
            handleClose={handleMenuClose}
            isShowVersionItem={true}
          />

          {/* Level 1 Menu Based*/}
          <LevelMenu
            {...menu.darktheme}
            handleOpen={handleMenuOpen}
            handleClose={handleMenuClose}
          />
        </Toolbar>
      </AppBar>
      <Toolbar></Toolbar>
    </Fragment>
  );
}

export default connect(null, { toggleMenuLeft })(Header);
