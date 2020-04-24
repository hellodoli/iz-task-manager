import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import clsx from 'clsx';

import { SCHEDULE_DATE } from '../../constants/schedule';
import { TASK_ALL, TASK_TODAY, TASK_OTHER } from '../../constants/location';

import { splitObjectByKey } from '../../utils/ob';
import { setScheduleDate } from '../../utils/time';

import { getTask } from '../../actions/task';

import { FormControlLabel, Checkbox } from '@material-ui/core';
import { green, amber, purple, red, grey } from '@material-ui/core/colors';
import { muiTaskGeneral, muiTaskItem } from './styled';

function setScheduleStatusColor(scheduleText, schedule) {
  let color = '';
  if (scheduleText === SCHEDULE_DATE.today) {
    color = green[500];
  } else if (scheduleText === SCHEDULE_DATE.tomorrow) {
    color = amber[500];
  } else if (
    scheduleText === SCHEDULE_DATE.mon ||
    scheduleText === SCHEDULE_DATE.tue ||
    scheduleText === SCHEDULE_DATE.wed ||
    scheduleText === SCHEDULE_DATE.thurs ||
    scheduleText === SCHEDULE_DATE.fri ||
    scheduleText === SCHEDULE_DATE.sat ||
    scheduleText === SCHEDULE_DATE.sun
  ) {
    color = purple[500];
  } else {
    const curTime = new Date().getTime();
    const scheduleTime = new Date(schedule).getTime();
    if (curTime > scheduleTime) {
      // past date
      color = red[500];
    } else {
      // future date
      color = grey[500];
    }
  }
  return color;
}

// filter Task by schedule today or overday (use for component TasksToday)
function filterTaskByToday(tasks) {
  const cloneTasks = tasks.slice();
  const tasksToday = [];
  const tasksOverDue = [];

  const d = new Date();
  const curDate = d.toJSON(); // transfer to UTC
  const curDateString = d.toDateString();
  const date = parseInt(curDate.substring(8, 10));
  const month = parseInt(curDate.substring(5, 7));
  const year = parseInt(curDate.substring(0, 4));

  for (let index = 0; index < cloneTasks.length; index++) {
    const schedule = cloneTasks[index].schedule;
    if (schedule !== null) {
      const scheduleDate = parseInt(schedule.substring(8, 10));
      const scheduleMonth = parseInt(schedule.substring(5, 7));
      const scheduleYear = parseInt(schedule.substring(0, 4));
      if (scheduleYear === year && scheduleMonth === month) {
        if (scheduleDate === date) {
          tasksToday.push(cloneTasks[index]);
        } else if (scheduleDate < date) {
          tasksOverDue.push(cloneTasks[index]);
        }
      }
    }
  }

  return [
    {
      section: 'Overdue',
      items: tasksOverDue
    },
    {
      section: curDateString,
      items: tasksToday
    }
  ];
}

function TaskItem({
  taskItem: { des, schedule, section, subtasks, completed },
  isShowSchedule
}) {
  console.log(isShowSchedule);
  const classes = muiTaskItem();
  const scheduleText = setScheduleDate(schedule);
  const color = setScheduleStatusColor(scheduleText, schedule);
  const scheduleClasses = muiTaskItem({ color });

  const handleChange = event => {
    console.log(event.target.checked);
  };

  return (
    <div className={clsx('task-item', classes.wrapperItem)}>
      <div className={clsx('task-item-actions')}></div>
      <div className={clsx('task-item-detail', classes.wrapperItemDetail)}>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={completed}
                onChange={handleChange}
                color="primary"
              />
            }
          />
        </div>
        <div className={classes.wrapperItemContent}>
          <div className={classes.itemDes}>{des}</div>
          <div className={classes.wrapperItemContentBottom}>
            {isShowSchedule === true && schedule !== null && (
              <div className={scheduleClasses.itemDueDay}>{scheduleText}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TasksInbox({ tasks }) {
  const cloneTasks = tasks.slice();
  const tasksInbox = splitObjectByKey('section', cloneTasks);

  return (
    <div>
      {tasksInbox.map(({ section, items }, index) => (
        <div className="task-by-section" key={`taskBySection${index}`}>
          <div className="task-by-section-header">{section}</div>
          <div className="task-by-section-body">
            {items.map(taskItem => (
              <TaskItem
                key={taskItem._id}
                taskItem={taskItem}
                isShowSchedule={true}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TasksToday({ tasks }) {
  const tasksToday = filterTaskByToday(tasks);
  return (
    <div>
      {tasksToday.map(({ section, items }, index) => (
        <div
          className="task-by-schedule-today"
          key={`taskByScheduleToday${index}`}
        >
          <div className="task-by-schedule-today-header">{section}</div>
          <div className="task-by-schedule-today-body">
            {items.map(taskItem => (
              <TaskItem
                key={taskItem._id}
                taskItem={taskItem}
                isShowSchedule={false}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TaskHeader({ pathname }) {
  let taskHeader = '';
  const gClasses = muiTaskGeneral();

  if (pathname === TASK_ALL) {
    taskHeader = 'Inbox';
  } else if (pathname === TASK_OTHER) {
    taskHeader = 'Next 7 days';
  } else if (pathname === TASK_TODAY) {
    taskHeader = 'Today';
  }

  return (
    <header className={gClasses.wrapperHeader}>
      <h1 className={gClasses.wrapperHeaderTitle}>{taskHeader}</h1>
    </header>
  );
}

function TaskMain(props) {
  const { location, tasks, getTask } = props;
  const pathname = location.pathname;

  useEffect(() => {
    getTask(); // get All Tasks by User
    console.log('running fetch Task done');
  }, [getTask]);

  const renderTaskList = () => {
    if (!tasks || tasks.length === 0) return <div>Loading...</div>;
    if (tasks.length > 0) {
      if (pathname === TASK_ALL) return <TasksInbox tasks={tasks} />;
      if (pathname === TASK_TODAY) return <TasksToday tasks={tasks} />;
      if (pathname === TASK_OTHER) return <div>TASK_OTHER</div>;
      return null;
    }
  };

  return (
    <div>
      <TaskHeader pathname={pathname} />
      {/* render Tasks Main */}
      {renderTaskList()}
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
