import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { Switch } from 'react-router-dom';
// Task API Class
import TaskAPI from '../../apis/task';

import { keys } from '../../constants/task';
import { SCHEDULE_DATE } from '../../constants/schedule';
import { TASK_ALL, TASK_TODAY, TASK_UPCOMING } from '../../constants/location';
import {
  monthNames,
  dayNames,
  getWeekByDate,
  getSuggestScheduleDate,
} from '../../utils/time';

import { getTask, setTask } from '../../actions/task';
import { useLoading } from '../../hooks/loading';
import { useMediaBreakingPoint } from '../../hooks/mediaBp';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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
  List,
  ListItem,
  Typography,
} from '@material-ui/core';
import {
  Edit,
  Add as AddIcon,
  Delete as DeleteIcon,
  Schedule,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  DragIndicator as DragIndicatorIcon,
} from '@material-ui/icons';
import { green, amber, purple, red, grey } from '@material-ui/core/colors';
import { muiTaskGeneral, muiTaskItem } from './styled';
// Components
import Loading from '../Loading';
import { PublicRouter } from '../HOC/Router';
import {
  ModalAddTask,
  ModalCreateSection,
  ModalConFirm,
  createNewSection,
  getCloneTaskAfterAddSection,
} from './Dialog';

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

function reOrderList(taskSection) {
  return Object.values(taskSection).sort((a, b) => a.order - b.order);
}

function reOrderItem(taskItem, key) {
  return Object.values(taskItem).sort((a, b) => a.index[key] - b.index[key]);
}

// update UI. (for save edit - update)
function updateCloneTaskItemUI(tasks, currentTask, { taskId, sectionId }) {
  const { overdueKey, upcomingKey } = keys;
  const otherFilter = ['tasksInbox', 'tasksToday', 'tasksUpcoming'];
  const result = { ...tasks };

  otherFilter.forEach((taskDataProperty) => {
    const sections = Object.values(result[taskDataProperty]);
    // loop section
    for (let y = 0; y < sections.length; y++) {
      const items = sections[y].items;
      if (items && Object.values(items).length > 0) {
        if (items[taskId]) {
          if (currentTask === null) {
            delete items[taskId];
            if (Object.values(items).length === 0) {
              if (
                sectionId === overdueKey ||
                sectionId.search(upcomingKey) > -1
              ) {
                delete result[taskDataProperty][sectionId];
              }
            }
          } else {
            console.log('yes');
            items[taskId] = currentTask;
          }
          break;
        }
      }
    }
  });

  return result;
}

// Task Components
function TaskItem({
  sectionId,
  taskItem: { _id, des, schedule, completed, isOpen, scheduleText },

  childIndex,
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
    <Draggable draggableId={_id} index={childIndex}>
      {(provided) => {
        return (
          <ListItem
            className={clsx(
              'task-item',
              classes.wrapperItem,
              Boolean(anchorEl) && classes.wrapperItemActive
            )}
            elevation={0}
            disableGutters={true}
            ref={provided.innerRef}
            {...provided.draggableProps}
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
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={saveEdit}
                  >
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
              <div
                className={clsx(
                  'task-item-actions',
                  classes.wrapperItemAction,
                  classes.wrapperHidden
                )}
              >
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
                    horizontal: 'left',
                  }}
                  getContentAnchorEl={null}
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={closeScheduleMenu}
                >
                  <MenuItem>Comming soon</MenuItem>
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
                    des={des}
                  />
                )}
              </div>
            )}
            {/* Item Drag Handle */}
            <div
              className={clsx(
                'task-item-drag-handle',
                classes.dragHandle,
                classes.wrapperHidden
              )}
              {...provided.dragHandleProps}
            >
              <DragIndicatorIcon />
            </div>

            {/* Task Detail */}
            {!isOpen && (
              <div
                className={clsx('task-item-detail', classes.wrapperItemDetail)}
              >
                {/* Item checkbox completed*/}
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
                {/* Item detail des */}
                <div className="task-item-detail-des">
                  <div className={classes.itemDes}>
                    {isOpen ? fakeEditValue : des}
                  </div>
                  {schedule !== null && (
                    <div className={classes.wrapperItemContentBottom}>
                      <div className={classes.itemDueDay}>{scheduleText}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </ListItem>
        );
      }}
    </Draggable>
  );
}

function TaskHeader(props) {
  const {
    tasks,
    setTask,
    location: { pathname },
  } = props;
  const classes = muiTaskGeneral();
  const uMB = useMediaBreakingPoint();
  const isXSDown = uMB.isXS.down;

  const [, setIsLoading] = useLoading();

  /* --- START: Handle Add Task Action --- */
  const [isOpenAddTask, setIsOpenAddTask] = useState(false);

  const handleClickOpenAddTask = () => setIsOpenAddTask(true);

  const handleCloseAddTask = () => setIsOpenAddTask(false);
  /* --- END: Handle Add Task Action --- */

  /* --- START: Handle Add Section Action --- */
  const [isOpenAddSection, setIsOpenAddSection] = useState(false);

  const handleClickOpenAddSection = () => setIsOpenAddSection(true);

  const handleCloseAddSection = () => setIsOpenAddSection(false);

  const addSection = (sectionName) => {
    handleCloseAddSection();

    setIsLoading(true);
    createNewSection(tasks, sectionName)
      .then((newSection) => {
        setIsLoading(false);
        setTask(getCloneTaskAfterAddSection(tasks, newSection));
      })
      .catch(() => {
        setIsLoading(false);
        alert('add Section fail');
      });
  };
  /* --- END: Handle Add Section Action --- */

  const renderTitleHeaderText = () => {
    if (pathname === TASK_ALL) return 'Inbox';
    else if (pathname === TASK_TODAY) return 'Today';
  };

  const rederAddSectionFab = () => {
    if (pathname === TASK_ALL)
      return (
        <Fab
          variant="extended"
          size={isXSDown ? 'small' : 'medium'}
          color="default"
          aria-label="add section"
          onClick={handleClickOpenAddSection}
        >
          <AddIcon fontSize="small" />
          <span className={'ml'}>Add section</span>
        </Fab>
      );
    return null;
  };

  return (
    <Fragment>
      {/* (Modal) Add Task */}
      {isOpenAddTask && (
        <ModalAddTask
          {...props}
          isOpen={isOpenAddTask}
          handleClose={handleCloseAddTask}
        />
      )}
      {/* (Modal) Add Section */}
      {isOpenAddSection && (
        <ModalCreateSection
          isOpen={isOpenAddSection}
          handleClose={handleCloseAddSection}
          cbSave={addSection}
        />
      )}
      {/* Task Main Header */}
      <div className={clsx(classes.header, classes.headerMgBottom)}>
        <h1 className={classes.headerTitle}>{renderTitleHeaderText()}</h1>
        <div>
          {rederAddSectionFab()}
          <Fab
            variant="extended"
            size={isXSDown ? 'small' : 'medium'}
            color="primary"
            aria-label="add task"
            className={'ml'}
            onClick={handleClickOpenAddTask}
          >
            <AddIcon fontSize="small" />
            <span className={'ml'}>Add task</span>
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
          <div className={gClasses.subHeader}>
            <ButtonGroup variant="contained" color="secondary" size="small">
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
              variant="contained"
              color="primary"
              size="small"
              className={'ml'}
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
    location,
    setTask,

    taskClassName,
    taskDataProperty,
    taskOrder,
  } = props;
  const propsAddTaskModal = { tasks, location, setTask };
  const [, setIsLoading] = useLoading();

  useEffect(() => {
    // check every time user switch other tab
    if (prevPathNameTask !== null && prevPathNameTask !== location.pathname) {
      console.log('switch TASK pathname');
      if (prevEditTask !== null) {
        const { taskId, sectionId } = prevEditTask;
        const { taskDataProperty } = checkCurrentPathname(prevPathNameTask);
        const cloneTask = { ...tasks[taskDataProperty] };
        const prevTask = cloneTask[sectionId].items[taskId];
        prevTask.isOpen = false;

        setTask({
          ...tasks,
          [taskDataProperty]: cloneTask,
        });
        prevEditTask = null;
      }
    }
    prevPathNameTask = location.pathname;
  }, [location, setTask, taskDataProperty, tasks]);

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
    setIsLoading(true);
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
      setTask(updateCloneTaskItemUI(tasks, curTask, { taskId, sectionId }));
      setIsLoading(false);
    } else {
      // fail
      alert('update des fail');
      setIsLoading(false);
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
    setIsLoading(true);
    const taskAPI = new TaskAPI();
    await taskAPI.updateTask(taskOb);
    if (taskAPI.isUpdateSuccess) {
      // change UI after success
      const cloneTask = { ...tasks[taskDataProperty] };
      const curTask = cloneTask[sectionId].items[taskId];
      // set current complete status
      curTask.completed = taskOb.completed;
      // find other clone Task and update
      setTask(updateCloneTaskItemUI(tasks, curTask, { taskId, sectionId }));
      setIsLoading(false);
    } else {
      // fail
      alert('update completed fail');
      setIsLoading(false);
    }
  };

  const deleteTask = async (taskId, sectionId) => {
    setIsLoading(true);
    const taskAPI = new TaskAPI();
    await taskAPI.deleteTask(taskId);
    if (taskAPI.isDeleteSuccess) {
      setTask(updateCloneTaskItemUI(tasks, null, { taskId, sectionId }));
      setIsLoading(false);
    } else {
      // fail
      alert('delete fail');
      setIsLoading(false);
    }
  };

  // handle Dragging
  /*
   * source: droppableId, index
   * destination: droppableId, index
   */
  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const start = source.droppableId;
    const end = destination.droppableId;
    let arrDragTask = []; // array store task item need update order index

    if (start === end) {
      console.log('source.index: ', source.index);
      console.log('destination.index: ', destination.index);
      const cloneTasks = { ...tasks };
      const sectionTasks = cloneTasks[taskDataProperty][source.droppableId];

      function addDragTask(task, newIndex) {
        const index =
          source.droppableId === 'overdue'
            ? { ...task.index, byToday: newIndex, byUpcoming: newIndex }
            : { ...task.index, [taskOrder]: newIndex };

        arrDragTask.push({
          _id: task._id,
          index,
        });

        if (source.droppableId === 'overdue') {
          ['tasksToday', 'tasksUpcoming'].forEach(
            (taskDataProperty) =>
              (cloneTasks[taskDataProperty][source.droppableId].items[
                task._id
              ].index = index)
          );
        } else {
          sectionTasks.items[task._id].index = index;
        }
      }

      function handleIndexOrder(index, task) {
        if (source.index === index) {
          addDragTask(task, destination.index);
        } else if (destination.index === index) {
          addDragTask(task, source.index);
        } else {
          if (index !== task.index[taskOrder]) {
            addDragTask(task, index);
          }
        }
      }

      if (sectionTasks.items) {
        const arrSectionTasks = reOrderItem(sectionTasks.items, taskOrder);
        for (let i = 0; i < arrSectionTasks.length; i++) {
          handleIndexOrder(i, arrSectionTasks[i]);
        }
      }
      console.log('arrDragTask: ', arrDragTask);
      if (arrDragTask.length > 0) {
        setIsLoading(true);
        // update order database
        const taskAPI = new TaskAPI();
        await taskAPI.updateManyTask(arrDragTask);
        if (taskAPI.isUpdateManySuccess) {
          // update UI
          setTask(cloneTasks);
          setIsLoading(false);
        } else {
          alert('Drag fail');
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box>
        <div>
          {reOrderList(tasks[taskDataProperty]).map((section) => {
            const items = section.items
              ? reOrderItem(section.items, taskOrder)
              : [];
            return (
              <TaskListWrapper
                key={section._id}
                section={section}
                items={items}
                taskClassName={taskClassName}
                propsAddTaskModal={propsAddTaskModal}
                startOpenEditTask={startOpenEditTask}
                startCloseEditStart={startCloseEditStart}
                updateDesTask={updateDesTask}
                updateCompletedTask={updateCompletedTask}
                deleteTask={deleteTask}
              />
            );
          })}
        </div>
      </Box>
    </DragDropContext>
  );
}

function TaskListWrapper(props) {
  const {
    taskClassName,
    items,
    section: { _id: sectionId, section },
    propsAddTaskModal,
    ...rest
  } = props;

  const [isExpand, setIsExpand] = useState(false);
  const [isOpenAddTask, setIsOpenAddTask] = useState(false);
  const itemClasses = muiTaskItem();
  const classes = muiTaskGeneral({
    isExpand,
    section,
    isEmpty: items.length === 0,
  });

  const handleOpenAddTask = () => setIsOpenAddTask(true);
  const handleCloseAddTask = () => setIsOpenAddTask(false);

  const renderSectionHeader = () => {
    if (section === null) return null;
    return (
      <div className={clsx(`${taskClassName}-header`, classes.sectionHeader)}>
        <span
          className={classes.wrapperIconExpand}
          onClick={() => setIsExpand(!isExpand)}
        >
          {isExpand ? (
            <ExpandLessIcon fontSize="small" />
          ) : (
            <ExpandMoreIcon fontSize="small" />
          )}
        </span>
        <span className={'ml'}>{section}</span>
      </div>
    );
  };

  const renderSectionEmptyBody = () => {
    if (items.length === 0 && section !== null) {
      return (
        <Fragment>
          {/* Modal Add Task */}
          {isOpenAddTask && (
            <ModalAddTask
              {...propsAddTaskModal}
              isOpen={isOpenAddTask}
              handleClose={handleCloseAddTask}
              sectionId={sectionId}
            />
          )}
          <div className={itemClasses.wrapperItemEmpty}>
            <Fab size="small" color="primary" onClick={handleOpenAddTask}>
              <AddIcon fontSize="small" />
            </Fab>
          </div>
        </Fragment>
      );
    }
    return null;
  };

  return (
    <div className={clsx(taskClassName, classes.section)}>
      {/* Section Header */}
      {renderSectionHeader()}

      {/* Section Body */}
      <div className={clsx(`${taskClassName}-body`, classes.sectionBody)}>
        {/* Empty Data */}
        {renderSectionEmptyBody()}

        {items.length > 0 && (
          <Droppable droppableId={sectionId}>
            {(provied) => {
              return (
                <List ref={provied.innerRef} {...provied.droppableProps}>
                  {items.map((taskItem, index) => (
                    <TaskItem
                      key={taskItem._id}
                      taskItem={taskItem}
                      childIndex={index}
                      sectionId={sectionId}
                      {...rest}
                    />
                  ))}
                  {provied.placeholder}
                </List>
              );
            }}
          </Droppable>
        )}
      </div>
    </div>
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

function TaskMain(props) {
  const { tasks, getTask, location } = props;
  const taskLocationInfo = checkCurrentPathname(location.pathname); // get info location pathname
  const taskMainProps = { ...props, ...taskLocationInfo };

  useEffect(() => {
    getTask(); // get All Tasks by User
  }, [getTask]);

  if (!tasks.fetchDone) return <div>Loading...</div>;
  return (
    <div className="task-main">
      <Switch>
        <PublicRouter
          exact
          path={TASK_ALL}
          passesProps={taskMainProps}
          component={TaskWrapper}
        />
        <PublicRouter
          path={TASK_TODAY}
          passesProps={taskMainProps}
          component={TaskWrapper}
        />
        <PublicRouter
          path={TASK_UPCOMING}
          passesProps={taskMainProps}
          component={TaskWrapperUpcoming}
        />
      </Switch>
    </div>
  );
}

TaskMain.propTypes = {
  tasks: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  tasks: state.taskReducer,
});

export default connect(mapStateToProps, { getTask, setTask })(TaskMain);
