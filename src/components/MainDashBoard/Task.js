import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TASK_ALL, TASK_TODAY, TASK_OTHER } from '../../constants/location';

import { splitObjectByKey } from '../../utils/ob';
import { getLastDateOfMonth, monthNames, dayNames } from '../../utils/time';

import { getTask } from '../../actions/task';

import { FormControlLabel, Checkbox } from '@material-ui/core';
import { muiTaskGeneral, muiTaskItem } from './styled';

function renderSchedule(schedule) {
  if (schedule === null) return ''; // user not set schedule
  let scheduleText = '';
  const scheduleSet = schedule.substring(0, 10);
  const scheduleDate = parseInt(schedule.substring(8, 10));
  const scheduleMonth = parseInt(schedule.substring(5, 7));
  const scheduleYear = parseInt(scheduleSet.substring(0, 4));

  const d = new Date();
  const date = d.getUTCDate();
  const month = d.getUTCMonth() + 1;
  const year = d.getUTCFullYear();

  const tomorrow = date + 1;
  const yesterday = date - 1;
  const next7days = date + 7;
  const lastDateOfMonth = getLastDateOfMonth(month, year);

  const subYear = scheduleYear - year;
  if (subYear === 0) {
    // same year
    const subMonth = scheduleMonth - month;
    if (subMonth < 2) {
      if (subMonth < 0) {
        // past month
        if (
          subMonth === -1 &&
          yesterday === 0 &&
          scheduleDate === getLastDateOfMonth(month - 1, year)
        ) {
          scheduleText = 'Yesterday';
        } else {
          scheduleText = `${scheduleDate} ${monthNames[scheduleMonth - 1]}`;
        }
      } else {
        // same month
        if (subMonth === 0) {
          if (scheduleDate === date) {
            scheduleText = 'Today';
          } else if (scheduleDate === yesterday) {
            scheduleText = 'Yesterday';
          } else if (scheduleDate === tomorrow) {
            scheduleText = 'Tomorrow';
          } else if (scheduleDate > tomorrow && scheduleDate <= next7days) {
            const d = new Date();
            d.setUTCDate(scheduleDate);
            scheduleText = dayNames[d.getUTCDay()];
          } else {
            scheduleText = `${scheduleDate} ${monthNames[scheduleMonth - 1]}`;
          }
        } else {
          // next 1 month
          if (tomorrow > lastDateOfMonth && scheduleDate === 1) {
            scheduleText = 'Tomorrow';
          } else {
            const a =
              next7days > lastDateOfMonth
                ? lastDateOfMonth + scheduleDate
                : scheduleDate;
            if (a > tomorrow && a <= next7days) {
              const d = new Date();
              d.setUTCMonth(scheduleMonth - 1);
              d.setUTCDate(scheduleDate);
              scheduleText = dayNames[d.getUTCDay()];
            } else {
              scheduleText = `${scheduleDate} ${monthNames[scheduleMonth - 1]}`;
            }
          }
        }
      }
    } else {
      // next more 1 month
      scheduleText = `${scheduleDate} ${monthNames[scheduleMonth - 1]}`;
    }
  } else {
    if (subYear === 1) {
      // next 1 year
      if (
        tomorrow > lastDateOfMonth &&
        scheduleDate === 1 &&
        scheduleMonth === 1
      ) {
        scheduleText = 'Tomorrow';
      } else {
        const a =
          next7days > lastDateOfMonth
            ? lastDateOfMonth + scheduleDate
            : scheduleDate;
        if (a > tomorrow && a <= next7days) {
          const d = new Date();
          d.setUTCFullYear(scheduleYear);
          d.setUTCMonth(scheduleMonth - 1);
          d.setUTCDate(scheduleDate);
          scheduleText = dayNames[d.getUTCDay()];
        } else {
          scheduleText = `${scheduleDate} ${
            monthNames[scheduleMonth - 1]
          } ${scheduleYear}`;
        }
      }
    } else {
      scheduleText = `${scheduleDate} ${
        monthNames[scheduleMonth - 1]
      } ${scheduleYear}`;
    }
  }
  return scheduleText;
}

// { des, schedule, section, subtasks, completed }
function TaskItem() {
  const classes = muiTaskItem();
  const taskScheduleclasses = muiTaskItem();
  const completed = false;
  const [complete, setComplete] = useState(completed);

  const handleChange = event => {
    setComplete(event.target.checked);
  };

  return (
    <div className={classes.wrapperItem}>
      <div className={classes.wrapperItemDetail}>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={complete}
                onChange={handleChange}
                color="primary"
              />
            }
          />
        </div>
        <div className={classes.wrapperItemContent}>
          <div className={classes.itemDes}>Some thing to dos</div>
          <div className={classes.wrapperItemContentBottom}>
            <div className={classes.itemDueDay}>Schedule</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskWithSection({ tasks }) {
  return (
    <div>
      {tasks.map(task => (
        <TaskItem key={task._id} {...task} />
      ))}
    </div>
  );
}

function TaskMain(props) {
  const { location, tasks, getTask } = props;
  const pathname = location.pathname;
  const gClasses = muiTaskGeneral();
  const [tasksLocal, setTasksLocal] = useState([]);
  useEffect(() => {
    // getTask();
  }, [getTask]);

  const renderHeader = () => {
    let taskHeader = '';
    if (pathname === TASK_ALL) {
      taskHeader = 'Inbox';
    } else if (pathname === TASK_OTHER) {
      taskHeader = 'Next 7 days';
    } else if (pathname === TASK_TODAY) {
      taskHeader = 'Today';
    }
    return taskHeader;
  };

  const renderTaskByType = () => {
    if (tasks.length > 0) {
      // Fillter Item Before render
      setTasksLocal(splitObjectByKey('section', tasks));
      console.log('tasksLocal: ', tasksLocal);
      if (pathname === TASK_ALL) return <TaskWithSection tasks={tasksLocal} />;
      return null;
    }
    return null;
  };

  return (
    <div>
      <header className={gClasses.wrapperHeader}>
        <h1 className={gClasses.wrapperHeaderTitle}>{renderHeader()}</h1>
      </header>
      {/* render Tasks Main */}
      <div></div>
      {/* demo */}
      <TaskItem />
      <TaskItem />
      <TaskItem />
      <TaskItem />
      <TaskItem />
    </div>
  );
}

TaskMain.propTypes = {
  auth: PropTypes.object.isRequired,
  tasks: PropTypes.array
};

const mapStateToProps = state => ({
  auth: state.oauthReducer,
  tasks: state.taskReducer
});

export default connect(mapStateToProps, { getTask })(TaskMain);
