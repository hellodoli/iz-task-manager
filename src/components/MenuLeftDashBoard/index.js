import React from 'react';
import { NavLink } from 'react-router-dom';

// Icons
import { Inbox, CalendarToday, DateRange } from '@material-ui/icons';

import { muiFilterMenu, muiFilterMenuIcon } from './styled';

function MenuLeft() {
  const pathname = '/app';

  const menuClasses = muiFilterMenu();
  const iconClasses = {
    inbox: muiFilterMenuIcon({ name: '/' }).wrapperIcon,
    today: muiFilterMenuIcon({ name: 'today' }).wrapperIcon,
    other: muiFilterMenuIcon({ name: 'other' }).wrapperIcon
  };

  return (
    <div>
      <ul className={menuClasses.wrapperFilterMenuLeft}>
        <li>
          <NavLink exact to={`${pathname}/tasks`} activeClassName="selected">
            <span className={iconClasses.inbox}>
              <Inbox fontSize="inherit" />
            </span>
            <span>Inbox</span>
          </NavLink>
        </li>

        <li>
          <NavLink to={`${pathname}/tasks/today`} activeClassName="selected">
            <span className={iconClasses.today}>
              <CalendarToday fontSize="inherit" />
            </span>
            <span>Today</span>
          </NavLink>
        </li>

        <li>
          <NavLink to={`${pathname}/tasks/upcoming`} activeClassName="selected">
            <span className={iconClasses.other}>
              <DateRange fontSize="inherit" />
            </span>
            <span>Upcoming</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default MenuLeft;
