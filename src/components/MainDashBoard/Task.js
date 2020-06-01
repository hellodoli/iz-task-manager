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
  getSuggestScheduleDate,
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
  ListItem,
  Typography,
} from '@material-ui/core';
import {
  Edit,
  Add as AddIcon,
  Delete as DeleteIcon,
  Schedule,
  ExpandMore,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
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
  let taskOrder = '';
  if (pathname === TASK_ALL) {
    taskClassName = 'task-by-section';
    taskIdName = 'taskBySection';
    taskDataProperty = 'tasksInbox';
    taskOrder = 'bySection';
  } else if (pathname === TASK_TODAY) {
    taskClassName = 'task-by-schedule-today';
    taskIdName = 'taskByScheduleToday';
    taskDataProperty = 'tasksToday';
    taskOrder = 'byToday';
  } else if (pathname === TASK_UPCOMING) {
    taskClassName = 'task-by-upcoming';
    taskIdName = 'tasksByUpcoming';
    taskDataProperty = 'tasksUpcoming';
    taskOrder = 'byUpcoming';
  }
  return {
    taskClassName,
    taskIdName,
    taskDataProperty,
    taskOrder,
  };
}

function reOrderList(taskList) {
  const resultArr = Object.values(taskList);
  resultArr.sort((a, b) => a.order - b.order);

  /*resultArr.forEach((section) => {
    if (section.items) {
      Object.values(section.items).sort(
        (a, b) => a.index.bySection - b.index.bySection
      );
    } else {
      section.items = {};
    }
  });*/

  return resultArr;
}

// update UI. (for save edit - update)
function updateCloneTaskItemUI(
  tasks,
  currentFilter,
  currentTask,
  { taskId, sectionId },
  status
) {
  function condition(key) {
    if (key === currentFilter || key === 'sectionTasks' || key === 'fetchDone')
      return false;
    return true;
  }
  const otherFilter = Object.keys(tasks).filter(condition);
  const result = {};

  for (let i = 0; i < otherFilter.length; i++) {
    const key = otherFilter[i];
    result[key] = { ...tasks[key] }; // clone

    const k = Object.values(result[key]);
    // loop section
    for (let y = 0; y < k.length; y++) {
      if (k[y].items && Object.values(k[y].items).length > 0) {
        if (k[y].items[taskId]._id === taskId) {
          if (status === 'delete') {
            delete k[y].items[taskId];
          } else {
            k[y].items[taskId] = currentTask;
          }
          break;
        }
      }
    }
  }

  return result;
}

// Task Components
function TaskItem({
  parentIndex,
  childIndex,
  sectionId,
  taskItem: { _id, des, schedule, completed, isOpen, scheduleText },

  isShowSchedule,
  startOpenEditTask,
  startCloseEditStart,
  updateDesTask,
  updateCompletedTask,
  deleteTask,
}) {
  const [anchorEl, setAnchorEl] = useState(null); // schedule menu
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false); // modal confirm delete
  const [fakeEditValue, setFakeEditValue] = useState(des); // fake des
  const classes = muiTaskItem({
    color: setScheduleStatusColor(scheduleText, schedule),
  });
  const obIndex = { parentIndex, childIndex };

  // Handle Modal Delete
  const openModalDelete = () => setIsOpenModalDelete(true);
  const closeModalDelete = () => setIsOpenModalDelete(false);

  // Handle Schedule
  const openScheduleMenu = (e) => setAnchorEl(e.currentTarget);
  const closeScheduleMenu = () => setAnchorEl(null);

  // Handle Edit
  const cancelEdit = () => startCloseEditStart(_id, sectionId);

  const openEdit = () => startOpenEditTask(_id, sectionId);

  const editting = (e) => setFakeEditValue(e.target.value);

  const saveEdit = () =>
    updateDesTask(_id, sectionId, { id: _id, des: fakeEditValue });

  const check = (e) =>
    updateCompletedTask(_id, sectionId, {
      id: _id,
      completed: e.target.checked,
    });

  const removeTask = () => deleteTask(_id, sectionId);

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
              horizontal: 'center',
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
  const gClasses = muiTaskGeneral();

  /* --- START: Handle Add Task Action --- */
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOpen = () => setIsOpen(true);

  const handleClose = () => setIsOpen(false);
  /* --- END: Handle Add Task Action --- */

  const renderTitleHeaderText = () => {
    const {
      location: { pathname },
    } = props;
    if (pathname === TASK_ALL) return 'Inbox';
    else if (pathname === TASK_TODAY) return 'Today';
  };

  return (
    <Fragment>
      {/* (Modal) Add Task */}
      {isOpen && (
        <ModalAddTask {...props} isOpen={isOpen} handleClose={handleClose} />
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
  const [minDate, setMinDate] = useState(date);

  const [indexActiveWeekRow, setIndexActiveWeekRow] = useState(null);
  const [weekRow, setWeekRow] = useState([]);

  const handleChangeTabList = (e, newValue) => setIndexActiveWeekRow(newValue);

  const goToWeek = (pip) => {
    if (weekRow && weekRow.length > 0) {
      const _minDay = minDate.getDay();
      const _minDate = minDate.getDate();
      const _minMonth = minDate.getMonth() + 1;
      const _minYear = minDate.getFullYear();

      const dateOfWeek =
        pip === 'next' ? weekRow[weekRow.length - 1] : weekRow[0];
      const { date, month, year } = dateOfWeek;

      const dayNextOrPrevWeek = getSuggestScheduleDate(
        { inputDate: `${year}-${month}-${date}` },
        {
          tomorrow: true,
          yesterday: true,
        }
      );
      const nextOrPrevWeek = getWeekByDate(
        pip === 'next'
          ? { inputDate: dayNextOrPrevWeek.tomorrow }
          : { inputDate: dayNextOrPrevWeek.yesterday }
      );

      let activeIndex = null;
      if (pip !== 'next') {
        for (let i = 0; i < nextOrPrevWeek.length; i++) {
          const date = nextOrPrevWeek[i];
          if (
            date.getDay() === _minDay &&
            date.getDate() === _minDate &&
            date.getMonth() + 1 === _minMonth &&
            date.getFullYear() === _minYear
          ) {
            activeIndex = i;
            break;
          }
        }
      }

      let isDisabled = null;
      const nextOrPrevWeekRow = nextOrPrevWeek.map((date, index) => {
        if (pip === 'next') {
          isDisabled = false;
        } else {
          if (activeIndex) isDisabled = index < activeIndex;
          else isDisabled = false;
        }

        return {
          dayString: dayNames[date.getDay()],
          day: date.getDay(),
          date: date.getDate(),
          month: date.getMonth() + 1,
          year: date.getFullYear(),
          isDisabled,
        };
      });

      if (pip !== 'next' && activeIndex) setIndexActiveWeekRow(activeIndex);
      else setIndexActiveWeekRow(0);

      setWeekRow(nextOrPrevWeekRow); // set weekRow
    }
  };

  const goToCurrentWeek = () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    setMinDate(date);
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

  /* --- START: Handle Add Task Action --- */
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOpen = () => setIsOpen(true);

  const handleClose = () => setIsOpen(false);
  /* --- END: Handle Add Task Action --- */

  useEffect(() => {
    const week = getWeekByDate({ inputDate: minDate });
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
          isDisabled: activeIndex === null,
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
        <h1 className={gClasses.headerTitle}>{`${monthNames[info.month - 1]} ${
          info.year
        }`}</h1>
      );
    }
    return <Loading size={20} />;
  };

  const renderActiveDateText = () => {
    if (weekRow.length > 0) {
      const info = weekRow[indexActiveWeekRow];
      return <div>{`${info.date} ${monthNames[info.month - 1]}`}</div>;
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
                  <strong className="date">{date}</strong>
                </div>
              }
            />
          ))}
        </Tabs>
      </Paper>
    );
  };

  return (
    <Fragment>
      <div className={gClasses.headerMgBottom}>
        <div className={clsx(gClasses.header, gClasses.headerMgBottom)}>
          {/* Header left */}
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
            <Button
              variant="outlined"
              size="small"
              className={gClasses.todayButton}
              onClick={goToCurrentWeek}
            >
              Today
            </Button>
          </div>
        </div>
        {/* Week row */}
        <div className={gClasses.wrapperWeekRow}>{renderWeekRow()}</div>
      </div>

      <div className={gClasses.headerMgBottom}>
        <div className={gClasses.wrapperUpcomingAddTask}>
          <Typography variant="subtitle1">{renderActiveDateText()}</Typography>
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Add task
          </Button>
        </div>
      </div>
      {/* Modal Add task */}
      {isOpen && (
        <ModalAddTask
          {...props}
          isOpen={isOpen}
          handleClose={handleClose}
          activeDate={weekRow[indexActiveWeekRow]}
        />
      )}
    </Fragment>
  );
}

function TaskList(props) {
  const {
    tasks,
    location: { pathname },
    setTask,

    taskClassName,
    taskIdName,
    taskDataProperty,
    taskOrder,
  } = props;

  const classes = muiTaskGeneral(); // mui class (general class)
  const itemClasses = muiTaskItem();

  useEffect(() => {
    // check every time user switch other tab
    if (prevPathNameTask !== null && prevPathNameTask !== pathname) {
      console.log('switch TASK pathname');
      if (prevEditTask !== null) {
        const {
          obIndex: { parentIndex, childIndex },
        } = prevEditTask;
        const { taskDataProperty } = checkCurrentPathname(prevPathNameTask);

        const cloneTask = tasks[taskDataProperty].slice();
        const prevTask = cloneTask[parentIndex].items[childIndex];
        prevTask.isOpen = false;

        setTask({
          ...tasks,
          [taskDataProperty]: cloneTask,
        });
        prevEditTask = null;
      }
    }
    prevPathNameTask = pathname;
  }, [pathname, setTask, tasks]);

  const startOpenEditTask = (taskId, sectionId) => {
    const cloneTask = { ...tasks[taskDataProperty] };
    if (prevEditTask !== null) {
      const { taskId: prevTaskId, sectionId: prevSectionId } = prevEditTask;
      // get prev Task
      const prevTask = cloneTask[prevSectionId].items[prevTaskId];
      prevTask.isOpen = false;
    }

    // get current Task
    const curTask = cloneTask[sectionId].items[taskId];
    curTask.isOpen = true;

    setTask({ ...tasks, [taskDataProperty]: cloneTask });
    prevEditTask = { taskId, sectionId };
  };

  const updateDesTask = async (taskId, sectionId, taskOb) => {
    prevEditTask = null;
    const taskAPI = new TaskAPI();
    await taskAPI.updateTask(taskOb);
    if (taskAPI.isUpdateSuccess) {
      // change UI after success
      const cloneTask = { ...tasks[taskDataProperty] };
      const curTask = cloneTask[sectionId].items[taskId];
      // set current isOpen status
      curTask.isOpen = false;
      curTask.des = taskOb.des;
      // find other clone Task and update
      const otherCloneTask = updateCloneTaskItemUI(
        tasks,
        taskDataProperty,
        curTask,
        { taskId, sectionId }
      );
      setTask({
        ...tasks,
        [taskDataProperty]: cloneTask,
        ...otherCloneTask,
      });
    } else {
      // fail
      alert('update des fail');
    }
  };

  const startCloseEditStart = (taskId, sectionId) => {
    prevEditTask = null;
    const cloneTask = { ...tasks[taskDataProperty] };
    const curTask = cloneTask[sectionId].items[taskId];
    // set current isOpen status
    curTask.isOpen = false;
    setTask({ ...tasks, [taskDataProperty]: cloneTask });
  };

  const updateCompletedTask = async (taskId, sectionId, taskOb) => {
    const taskAPI = new TaskAPI();
    await taskAPI.updateTask(taskOb);
    if (taskAPI.isUpdateSuccess) {
      // change UI after success
      const cloneTask = { ...tasks[taskDataProperty] };
      const curTask = cloneTask[sectionId].items[taskId];
      // set current complete status
      curTask.completed = taskOb.completed;
      // find other clone Task and update
      const otherCloneTask = updateCloneTaskItemUI(
        tasks,
        taskDataProperty,
        curTask,
        { taskId, sectionId }
      );
      setTask({
        ...tasks,
        [taskDataProperty]: cloneTask,
        ...otherCloneTask,
      });
    } else {
      // fail
      alert('update completed fail');
    }
  };

  const deleteTask = async (taskId, sectionId) => {
    const taskAPI = new TaskAPI();
    await taskAPI.deleteTask(taskId);
    if (taskAPI.isDeleteSuccess) {
      // delete current task
      const cloneTask = { ...tasks[taskDataProperty] };
      delete cloneTask[sectionId].items[taskId];
      // change UI after success
      // find other clone Task and delete
      const otherCloneTask = updateCloneTaskItemUI(
        tasks,
        taskDataProperty,
        null,
        { taskId, sectionId },
        'delete'
      );
      setTask({
        ...tasks,
        [taskDataProperty]: cloneTask,
        ...otherCloneTask,
      });
    } else {
      // fail
      alert('delete fail');
    }
  };

  return (
    <Box>
      {/* Task Main List */}
      <div className={classes.wrapperAllSection}>
        {reOrderList(tasks[taskDataProperty]).map((s, index) => {
          const parentIndex = index;
          const section = s.section;
          const sectionId = s._id;
          const items = s.items
            ? Object.values(s.items).sort(
                (a, b) => a.index[taskOrder] - b.index[taskOrder]
              )
            : [];
          return (
            <ExpansionPanel
              // TransitionProps={{ unmountOnExit: true }}
              key={`${taskIdName}${parentIndex}`}
              className={clsx(taskClassName, classes.section)}
            >
              <ExpansionPanelSummary
                className={clsx(
                  `${taskClassName}-header`,
                  classes.sectionHeader
                )}
                expandIcon={<ExpandMore />}
              >
                {section === null ? <em>(No section)</em> : section}
              </ExpansionPanelSummary>

              <ExpansionPanelDetails className={`${taskClassName}-body`}>
                {/* render data */}
                {items.length === 0 ? (
                  <div className={itemClasses.wrapperItemEmpty}>
                    <Fab size="small" color="secondary">
                      <AddIcon />
                    </Fab>
                  </div>
                ) : (
                  <List>
                    {items.map((taskItem, index) => (
                      <TaskItem
                        key={taskItem._id}
                        parentIndex={parentIndex}
                        childIndex={index}
                        taskItem={taskItem}
                        sectionId={sectionId}
                        isShowSchedule={true} // temp
                        startOpenEditTask={startOpenEditTask}
                        startCloseEditStart={startCloseEditStart}
                        updateDesTask={updateDesTask}
                        updateCompletedTask={updateCompletedTask}
                        deleteTask={deleteTask}
                      />
                    ))}
                  </List>
                )}
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        })}
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
      render={(routerProps) => <Component {...passesProps} {...routerProps} />}
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
  tasks: PropTypes.object,
};

const mapStateToProps = (state) => ({
  auth: state.oauthReducer,
  tasks: state.taskReducer,
});

export default connect(mapStateToProps, { getTask, setTask })(TaskMain);
