import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

// Task API Class
import TaskAPI from '../../apis/task';

import { SCHEDULE_DATE } from '../../constants/schedule';
import { TASK_ALL, TASK_TODAY, TASK_UPCOMING } from '../../constants/location';

import {
  monthNames,
  dayNames,
  getWeekByDate,
  getSuggestScheduleDate
} from '../../utils/time';

import { getTask, setTask } from '../../actions/task';

// Components
import { ModalAddTask, ModalConFirm } from './Dialog';

// Styling
import {
  FormControlLabel,
  Checkbox,
  Paper,
  IconButton,
  TextField,
  Button,
  ButtonGroup,
  Fab,
  Box,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  List,
  ListItem
} from '@material-ui/core';
import {
  Edit,
  Add as AddIcon,
  Delete as DeleteIcon,
  Schedule,
  ExpandMore,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@material-ui/icons';
import { green, amber, purple, red, grey } from '@material-ui/core/colors';
import { muiTaskGeneral, muiTaskItem } from './styled';

// Components
import Loading from '../Loading';

let prevPathNameTask = null;
let prevEditTask = null;

// helper function
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

function checkCurrentPathname(pathname) {
  let taskClassName = '';
  let taskIdName = '';
  let taskDataProperty = '';
  if (pathname === TASK_ALL) {
    taskClassName = 'task-by-section';
    taskIdName = 'taskBySection';
    taskDataProperty = 'tasksInbox';
  } else if (pathname === TASK_TODAY) {
    taskClassName = 'task-by-schedule-today';
    taskIdName = 'taskByScheduleToday';
    taskDataProperty = 'tasksToday';
  } else if (pathname === TASK_UPCOMING) {
    taskClassName = 'task-by-upcoming';
    taskIdName = 'tasksByUpcoming';
    taskDataProperty = 'tasksUpcoming';
  }
  return {
    taskClassName,
    taskIdName,
    taskDataProperty
  };
}

// update UI. (for save edit - update)
function updateCloneTaskItemUI(tasks, currentFilter, currentTask, status) {
  function condition(key) {
    if (key === currentFilter || key === 'sectionTasks' || key === 'fetchDone')
      return false;
    return true;
  }
  const otherFilter = Object.keys(tasks).filter(condition);
  const result = {};

  otherFilter.forEach(key => {
    result[key] = tasks[key].slice();
    tasks[key].forEach((section, indexSection) => {
      section.items.forEach((task, indexTask) => {
        if (task._id === currentTask._id) {
          if (status === 'delete') {
            result[key][indexSection].items.splice(indexTask, 1);
          } else {
            result[key][indexSection].items.splice(indexTask, 1, currentTask);
          }
        }
      });
    });
  });

  return result;
}

// Task Components
function TaskItem({
  parentIndex,
  childIndex,
  taskItem: { _id, des, schedule, completed, isOpen, scheduleText },

  isShowSchedule,
  startOpenEditTask,
  startCloseEditStart,
  updateDesTask,
  updateCompletedTask,
  deleteTask
}) {
  const [anchorEl, setAnchorEl] = useState(null); // schedule menu
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false); // modal confirm delete
  const [fakeEditValue, setFakeEditValue] = useState(des); // fake des
  const classes = muiTaskItem({
    color: setScheduleStatusColor(scheduleText, schedule)
  });
  const obIndex = { parentIndex, childIndex };

  // Handle Modal Delete
  const openModalDelete = () => setIsOpenModalDelete(true);
  const closeModalDelete = () => setIsOpenModalDelete(false);

  // Handle Schedule
  const openScheduleMenu = e => setAnchorEl(e.currentTarget);
  const closeScheduleMenu = () => setAnchorEl(null);

  // Handle Edit
  const cancelEdit = () => startCloseEditStart(obIndex);

  const openEdit = () => startOpenEditTask(obIndex);

  const editting = e => setFakeEditValue(e.target.value);

  const saveEdit = () =>
    updateDesTask(obIndex, { id: _id, des: fakeEditValue });

  const check = e =>
    updateCompletedTask(obIndex, { id: _id, completed: e.target.checked });

  const removeTask = () => deleteTask(obIndex, _id);

  useEffect(() => {
    if (!isOpen && fakeEditValue !== des) setFakeEditValue(des);
  }, [isOpen, fakeEditValue, des]);

  return (
    <ListItem
      elevation={0}
      className={clsx(
        'task-item',
        classes.wrapperItem,
        Boolean(anchorEl) && classes.wrapperItemActive
      )}
    >
      {/* Task Edit */}
      {isOpen && (
        <div className={clsx('task-item-edit', classes.wrapperItemEdit)}>
          <TextField
            variant="outlined"
            value={fakeEditValue}
            size="small"
            color="primary"
            fullWidth={true}
            autoFocus={true}
            onChange={editting}
          />
          <div className={classes.buttonEditGroup}>
            <Button variant="contained" color="primary" onClick={saveEdit}>
              Save
            </Button>
            {'  '}
            <Button variant="text" onClick={cancelEdit}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      {/* Task Action */}
      {!isOpen && (
        <div className={clsx('task-item-actions', classes.wrapperItemAction)}>
          <IconButton size="small" onClick={openEdit}>
            <Edit />
          </IconButton>

          <IconButton size="small" onClick={openScheduleMenu}>
            <Schedule />
          </IconButton>
          {/* Schedule Menu */}
          <Menu
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            getContentAnchorEl={null}
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={closeScheduleMenu}
          >
            <MenuItem>Item 1</MenuItem>
            <MenuItem>Item 2</MenuItem>
            <MenuItem>Item 3</MenuItem>
          </Menu>

          <IconButton
            style={{ color: red[500] }}
            size="small"
            color="default"
            onClick={openModalDelete}
          >
            <DeleteIcon />
          </IconButton>
          {/* Modal Delete */}
          {isOpenModalDelete && (
            <ModalConFirm
              removeTask={removeTask}
              isOpen={isOpenModalDelete}
              handleClose={closeModalDelete}
            />
          )}
        </div>
      )}
      {/* Task Detail */}
      {!isOpen && (
        <div className={clsx('task-item-detail', classes.wrapperItemDetail)}>
          <div className="task-item-detail-checkbox">
            <FormControlLabel
              control={
                <Checkbox
                  checked={completed}
                  onChange={check}
                  size="small"
                  color="primary"
                />
              }
            />
          </div>
          <div className={classes.wrapperItemContent}>
            <div className={classes.itemDes}>
              {isOpen ? fakeEditValue : des}
            </div>
            <div className={classes.wrapperItemContentBottom}>
              {isShowSchedule === true && schedule !== null && (
                <div className={classes.itemDueDay}>{scheduleText}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </ListItem>
  );
}

function TaskHeader(props) {
  const {
    location: { pathname },
    tasks: { sectionTasks },
    setTask
  } = props;
  const gClasses = muiTaskGeneral();

  /* --- START: Handle Add Task Action --- */
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOpen = () => setIsOpen(true);

  const handleClose = () => setIsOpen(false);
  /* --- END: Handle Add Task Action --- */

  const renderTitleHeaderText = () => {
    if (pathname === TASK_ALL) return 'Inbox';
    else if (pathname === TASK_TODAY) return 'Today';
  };

  return (
    <Fragment>
      {/* (Modal) Add Task */}
      {isOpen && (
        <ModalAddTask
          pathname={pathname} // pathname use for render text
          isOpen={isOpen}
          handleClose={handleClose}
          sectionTasks={sectionTasks}
          setTask={setTask}
        />
      )}
      {/* Task Main Header */}
      <div className={clsx(gClasses.header, gClasses.headerMgBottom)}>
        <h1 className={gClasses.headerTitle}>{renderTitleHeaderText()}</h1>
        <div>
          <Fab
            variant="extended"
            size="small"
            color="primary"
            aria-label="add task"
            onClick={handleClickOpen}
          >
            <AddIcon />
            Add task
          </Fab>
        </div>
      </div>
    </Fragment>
  );
}

function TaskHeaderUpcoming(props) {
  const gClasses = muiTaskGeneral();
  // set min date
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const [minDate] = useState(date);

  const [indexActiveWeekRow, setIndexActiveWeekRow] = useState(null);
  const [weekRow, setWeekRow] = useState([]);

  const handleChangeTabList = (e, newValue) => setIndexActiveWeekRow(newValue);

  const goToWeek = pip => {
    if (weekRow && weekRow.length > 0) {
      const _minDate = minDate.getDate();
      const _minMonth = minDate.getMonth() + 1;
      const _minYear = minDate.getFullYear();

      const dateOfWeek =
        pip === 'next' ? weekRow[weekRow.length - 1] : weekRow[0];
      const { date, month, year } = dateOfWeek;

      const dayNextOrPrevWeek = getSuggestScheduleDate(
        new Date(`${year}-${month}-${date}`),
        {
          tomorrow: true,
          yesterday: true
        }
      );
      const nextOrPrevWeek = getWeekByDate(
        pip === 'next'
          ? dayNextOrPrevWeek.tomorrow
          : dayNextOrPrevWeek.yesterday
      );

      let activeIndex = null;
      const nextOrPrevWeekRow = nextOrPrevWeek.map((date, index) => {
        const day = date.getDay();
        if (pip !== 'next' && day === minDate.getDay()) activeIndex = index;
        return {
          dayString: dayNames[day],
          day: date.getDay(),
          date: date.getDate(),
          month: date.getMonth() + 1,
          year: date.getFullYear(),
          isDisabled: pip === 'next' ? false : activeIndex === null
        };
      });
      setIndexActiveWeekRow(0);
      setWeekRow(nextOrPrevWeekRow); // set weekRow
    }
  };

  const isDasbledPrevWeekRow = () => {
    if (weekRow && weekRow.length > 0) {
      const _minDate = minDate.getDate();
      const _minMonth = minDate.getMonth() + 1;
      const _minYear = minDate.getFullYear();
      for (let i = 0; i < weekRow.length; i++) {
        const { date, month, year } = weekRow[i];
        if (date === _minDate && month === _minMonth && year === _minYear)
          return true;
      }
      return false;
    }
    return null;
  };

  useEffect(() => {
    const week = getWeekByDate(minDate);
    if (week && week.length > 0) {
      let activeIndex = null;
      const weekRow = week.map((date, index) => {
        const day = date.getDay();
        if (day === minDate.getDay()) activeIndex = index;

        return {
          dayString: dayNames[day],
          day: date.getDay(),
          date: date.getDate(),
          month: date.getMonth() + 1,
          year: date.getFullYear(),
          isDisabled: activeIndex === null
        };
      });
      // set weekRow
      setIndexActiveWeekRow(activeIndex);
      setWeekRow(weekRow);
    }
  }, [minDate]);

  const renderTitleHeader = () => {
    if (weekRow.length > 0) {
      const info = weekRow[0];
      return (
        <h1 className={gClasses.headerTitle}>{`${monthNames[info.month]} ${
          info.year
        }`}</h1>
      );
    }
    return <Loading size={20} />;
  };

  const renderWeekRow = () => {
    if (weekRow.length === 0) return <Loading size={30} />;
    return (
      <Paper square>
        <Tabs
          value={indexActiveWeekRow}
          onChange={handleChangeTabList}
          variant="fullWidth"
          indicatorColor="secondary"
          textColor="secondary"
        >
          {weekRow.map(({ dayString, date, month, year, isDisabled }) => (
            <Tab
              key={`${year}-${month}-${date}`}
              disabled={isDisabled}
              label={
                <div>
                  <div className="day">{dayString}</div>
                  <div>
                    <strong className="date">{date}</strong>
                  </div>
                </div>
              }
            />
          ))}
        </Tabs>
      </Paper>
    );
  };

  return (
    <div className={gClasses.headerMgBottomL}>
      <div className={clsx(gClasses.header, gClasses.headerMgBottom)}>
        {renderTitleHeader()}
        {/* Header right */}
        <div className={gClasses.header}>
          <ButtonGroup variant="outlined" color="secondary" size="small">
            <Button
              disabled={isDasbledPrevWeekRow()}
              onClick={() => goToWeek('prev')}
            >
              <ChevronLeftIcon />
            </Button>
            <Button onClick={() => goToWeek('next')}>
              <ChevronRightIcon />
            </Button>
          </ButtonGroup>
          {'  '}
          <Button>Today</Button>
        </div>
      </div>
      <div className={gClasses.flexCenter}>{renderWeekRow()}</div>
    </div>
  );
}

function TaskList(props) {
  const {
    tasks,
    location: { pathname },
    setTask,

    taskClassName,
    taskIdName,
    taskDataProperty
  } = props;

  const gClasses = muiTaskGeneral(); // mui class (general class)

  useEffect(() => {
    // check every time user switch other tab
    if (prevPathNameTask !== null && prevPathNameTask !== pathname) {
      console.log('switch TASK pathname');
      if (prevEditTask !== null) {
        const {
          obIndex: { parentIndex, childIndex }
        } = prevEditTask;
        const { taskDataProperty } = checkCurrentPathname(prevPathNameTask);

        const cloneTask = tasks[taskDataProperty].slice();
        const prevTask = cloneTask[parentIndex].items[childIndex];
        prevTask.isOpen = false;

        setTask({
          ...tasks,
          [taskDataProperty]: cloneTask
        });
        prevEditTask = null;
      }
    }
    prevPathNameTask = pathname;
  }, [pathname, setTask, tasks]);

  const startOpenEditTask = obIndex => {
    const cloneTask = tasks[taskDataProperty].slice();
    if (prevEditTask !== null) {
      const {
        obIndex: { parentIndex: prevParentIndex, childIndex: prevChildIndex }
      } = prevEditTask;
      // get prev Task
      const prevTask = cloneTask[prevParentIndex].items[prevChildIndex];
      prevTask.isOpen = false;
    }

    // get current Task
    const { parentIndex, childIndex } = obIndex;
    const curTask = cloneTask[parentIndex].items[childIndex];
    curTask.isOpen = true;

    setTask({ ...tasks, [taskDataProperty]: cloneTask });
    prevEditTask = { obIndex };
  };

  const updateDesTask = async (obIndex, taskOb) => {
    prevEditTask = null;
    const taskAPI = new TaskAPI();
    await taskAPI.updateTask(taskOb);
    if (taskAPI.isUpdateSuccess) {
      // change UI after success
      const { parentIndex, childIndex } = obIndex;
      const cloneTask = tasks[taskDataProperty].slice();
      const curTask = cloneTask[parentIndex].items[childIndex];
      // set current isOpen status
      curTask.isOpen = false;
      curTask.des = taskOb.des;
      // find other clone Task and update
      const otherCloneTask = updateCloneTaskItemUI(
        tasks,
        taskDataProperty,
        curTask
      );
      setTask({
        ...tasks,
        [taskDataProperty]: cloneTask,
        ...otherCloneTask
      });
    } else {
      // fail
      alert('update des fail');
    }
  };

  const startCloseEditStart = obIndex => {
    prevEditTask = null;
    const { parentIndex, childIndex } = obIndex;
    const cloneTask = tasks[taskDataProperty].slice();
    const curTask = cloneTask[parentIndex].items[childIndex];
    // set current isOpen status
    curTask.isOpen = false;
    setTask({ ...tasks, [taskDataProperty]: cloneTask });
  };

  const updateCompletedTask = async (obIndex, taskOb) => {
    const taskAPI = new TaskAPI();
    await taskAPI.updateTask(taskOb);
    if (taskAPI.isUpdateSuccess) {
      // change UI after success
      const { parentIndex, childIndex } = obIndex;
      const cloneTask = tasks[taskDataProperty].slice();
      const curTask = cloneTask[parentIndex].items[childIndex];
      // set current complete status
      curTask.completed = taskOb.completed;
      // find other clone Task and update
      const otherCloneTask = updateCloneTaskItemUI(
        tasks,
        taskDataProperty,
        curTask
      );
      setTask({
        ...tasks,
        [taskDataProperty]: cloneTask,
        ...otherCloneTask
      });
    } else {
      // fail
      alert('update completed fail');
    }
  };

  const deleteTask = async (obIndex, taskId) => {
    const taskAPI = new TaskAPI();
    await taskAPI.deleteTask(taskId);
    if (taskAPI.isDeleteSuccess) {
      // change UI after success
      const { parentIndex, childIndex } = obIndex;
      const cloneTask = tasks[taskDataProperty].slice();
      const curTask = cloneTask[parentIndex].items[childIndex];
      // delete current task
      cloneTask[parentIndex].items.splice(childIndex, 1);
      // find other clone Task and delete
      const otherCloneTask = updateCloneTaskItemUI(
        tasks,
        taskDataProperty,
        curTask,
        'delete'
      );
      setTask({
        ...tasks,
        [taskDataProperty]: cloneTask,
        ...otherCloneTask
      });
    } else {
      // fail
      alert('delete fail');
    }
  };

  return (
    <Box>
      {/* Task Main List */}
      <div className={gClasses.wrapperAllSection}>
        {tasks[taskDataProperty].map(({ section, items }, index) => {
          const parentIndex = index;
          return (
            <ExpansionPanel
              // TransitionProps={{ unmountOnExit: true }}
              key={`${taskIdName}${parentIndex}`}
              className={clsx(taskClassName, gClasses.section)}
            >
              <ExpansionPanelSummary
                className={clsx(
                  `${taskClassName}-header`,
                  gClasses.sectionHeader
                )}
                expandIcon={<ExpandMore />}
              >
                {section === null ? <em>(No section)</em> : section}
              </ExpansionPanelSummary>

              <ExpansionPanelDetails className={`${taskClassName}-body`}>
                <List>
                  {items.map((taskItem, index) => (
                    <TaskItem
                      key={taskItem._id}
                      parentIndex={parentIndex}
                      childIndex={index}
                      taskItem={taskItem}
                      isShowSchedule={true} // temp
                      startOpenEditTask={startOpenEditTask}
                      startCloseEditStart={startCloseEditStart}
                      updateDesTask={updateDesTask}
                      updateCompletedTask={updateCompletedTask}
                      deleteTask={deleteTask}
                    />
                  ))}
                </List>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        })}
      </div>
      {/* Quick Add Button */}
      <div className={gClasses.wrapperQuickAddTask}>
        <Fab variant="round" size="small" color="secondary" aria-label="add">
          <AddIcon />
        </Fab>
      </div>
    </Box>
  );
}

// TaskWrapper type
function TaskWrapper(props) {
  return (
    <Fragment>
      <TaskHeader {...props} />
      <TaskList {...props} />
    </Fragment>
  );
}

function TaskWrapperUpcoming(props) {
  return (
    <Fragment>
      <TaskHeaderUpcoming {...props} />
      <TaskList {...props} />
    </Fragment>
  );
}

// RouteWrapper
function RouteWrapper({ component: Component, passesProps, ...rest }) {
  // important: passesProps contains history, location, match but we dont need
  // rest: exact, path
  return (
    <Route
      {...rest}
      render={routerProps => <Component {...passesProps} {...routerProps} />}
    />
  );
}

function TaskMain(props) {
  const { tasks, getTask, location } = props;
  const taskLocationInfo = checkCurrentPathname(location.pathname); // get info location pathname
  const taskMainProps = { ...props, ...taskLocationInfo };

  useEffect(() => {
    getTask(); // get All Tasks by User
    console.log('running fetch Task done');
  }, [getTask]);

  if (!tasks.fetchDone) return <div>Loading...</div>;
  return (
    <div className="task-main">
      <Switch>
        <RouteWrapper
          exact={true}
          path={TASK_ALL}
          passesProps={taskMainProps}
          component={TaskWrapper}
        />
        <RouteWrapper
          exact={false}
          path={TASK_TODAY}
          passesProps={taskMainProps}
          component={TaskWrapper}
        />
        <RouteWrapper
          exact={false}
          path={TASK_UPCOMING}
          passesProps={taskMainProps}
          component={TaskWrapperUpcoming}
        />
      </Switch>
    </div>
  );
}

TaskMain.propTypes = {
  auth: PropTypes.object.isRequired,
  tasks: PropTypes.object
};

const mapStateToProps = state => ({
  auth: state.oauthReducer,
  tasks: state.taskReducer
});

export default connect(mapStateToProps, { getTask, setTask })(TaskMain);
