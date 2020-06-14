import React from 'react';
import { NavLink } from 'react-router-dom';

import { TASK_ALL, TASK_TODAY, TASK_UPCOMING } from '../../constants/location';

// Icons
import {
  Inbox as InboxIcon,
  CalendarToday as CalendarTodayIcon,
  DateRange as DateRangeIcon,
  ChevronRight as ChevronRightIcon,
} from '@material-ui/icons';
import { muiFilterMenu, muiFilterMenuIcon } from './styled';

function MenuLeft() {
  const menuClasses = muiFilterMenu();
  const iconClasses = (name) => muiFilterMenuIcon({ name }).wrapperIcon;

  return (
    <div>
      <ul className={menuClasses.wrapperFilterMenuLeft}>
        <li>
          <NavLink exact to={TASK_ALL} activeClassName="selected">
            <span className={iconClasses(TASK_ALL)}>
              <InboxIcon fontSize="inherit" />
            </span>
            <span>Inbox</span>
          </NavLink>
        </li>
        <li>
          <NavLink to={TASK_TODAY} activeClassName="selected">
            <span className={iconClasses(TASK_TODAY)}>
              <CalendarTodayIcon fontSize="inherit" />
            </span>
            <span>Today</span>
          </NavLink>
        </li>
        <li>
          <NavLink to={TASK_UPCOMING} activeClassName="selected">
            <span className={iconClasses(TASK_UPCOMING)}>
              <DateRangeIcon fontSize="inherit" />
            </span>
            <span>Upcoming</span>
          </NavLink>
        </li>
      </ul>
      {/* comming feature */}
      <div>
        <ul className={menuClasses.wrapperFilterMenuLeft}>
          <li>
            <NavLink to={'#'}>
              <span className={iconClasses('other')}>
                <ChevronRightIcon />
              </span>
              <span>Project (comming soon)</span>
            </NavLink>
          </li>
          <li>
            <NavLink to={'#'}>
              <span className={iconClasses('other')}>
                <ChevronRightIcon />
              </span>
              <span>Label (comming soon)</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default MenuLeft;
