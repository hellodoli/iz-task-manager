import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

// Task API Class
import TaskAPI from '../../apis/task';

import { SCHEDULE_DATE } from '../../constants/schedule';
import { TASK_ALL, TASK_TODAY, TASK_UPCOMING } from '../../constants/location';

import { dayNames, monthNames, getWeekByDate } from '../../utils/time';
import { getCookie } from '../../utils/cookies';

import { getTask, setTask } from '../../actions/task';

// Styling
import {
  FormControlLabel,
  Checkbox,
  Paper,
  IconButton,
  TextField,
  Button,
  Fab,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
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
  AddCircle,
  Schedule,
  ExpandMore
} from '@material-ui/icons';
import { green, amber, purple, red, grey } from '@material-ui/core/colors';
import { muiTaskGeneral, muiTaskItem, muiAddTaskModal } from './styled';

let prevPathNameTask = null;
let prevEditTask = null;
let numberSectionTasks = null;

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

function checkCurrentPathname (pathname) {
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
function updateCloneTaskItemUI (tasks, currentFilter, currentTask) {
  function condition(key) {
    if (key === currentFilter
      || key === 'sectionTasks'
      || key === 'fetchDone')
      return false;
    return true;
  };
  const otherFilter = Object.keys(tasks).filter(condition);
  const result = {};
  
  otherFilter.forEach(key => {
    result[key] = tasks[key].slice();
    tasks[key].forEach((section, indexSection) => {
      section.items.forEach((task,indexTask) => {
        if (task._id === currentTask._id) {
          result[key][indexSection].items
            .splice(indexTask, 1, currentTask);
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
  updateDesTask
}) {
  const [anchorEl, setAnchorEl] = useState(null); // handle schedule menu
  const [valueEdit, setValueEdit] = useState(des);
  const classes = muiTaskItem({
    color: setScheduleStatusColor(scheduleText, schedule)
  });
  const obIndex = { parentIndex, childIndex };

  // Handle Schedule  
  const openScheduleMenu = e => setAnchorEl(e.currentTarget);
  const closeScheduleMenu = () => setAnchorEl(null);
    
  // Handle Edit
  const cancelEdit = () => startCloseEditStart(obIndex);
    
  const openEdit = () => startOpenEditTask(obIndex);

  const editing = e => setValueEdit(e.target.value);
    
  const saveEdit = () => updateDesTask(obIndex, { id: _id, des: valueEdit });

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
      { isOpen &&
          <div className={clsx("task-item-edit", classes.wrapperItemEdit)}>
            <TextField
              variant="outlined"
              value={valueEdit}
              size="small"
              color="primary"
              fullWidth={true}
              autoFocus={true}
              onChange={editing}
            />
            <div className={classes.buttonEditGroup}>
              <Button
                variant="contained"
                color="primary"
                onClick={saveEdit}
                >
                  Save</Button>{'  '}
              <Button
                variant="text"
                onClick={cancelEdit}
              >Cancel</Button>
            </div>
          </div>
      }
      {/* Task Action */}
      { !isOpen &&
        <div className={clsx('task-item-actions', classes.wrapperItemAction)}>
          <IconButton
            size="small"
            onClick={openEdit}
          >
            <Edit />
          </IconButton>
          
          <IconButton
            size="small"
            onClick={openScheduleMenu}
          >
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
        </div>
      }
      {/* Task Detail */}
      { !isOpen &&
        <div className={clsx('task-item-detail', classes.wrapperItemDetail)}>
          <div className="task-item-detail-checkbox">
            <FormControlLabel
              control={
                <Checkbox
                  checked={completed}
                  size="small"
                  color="primary"
                />
              }
            />
          </div>
          <div className={classes.wrapperItemContent}>
            <div className={classes.itemDes}>{ valueEdit }</div>
            <div className={classes.wrapperItemContentBottom}>
              {isShowSchedule === true && schedule !== null && (
                <div className={classes.itemDueDay}>{scheduleText}</div>
              )}
            </div>
          </div>
        </div>
      }
    </ListItem>
  );
}

function ModalCreateSection (props) {
  const { isOpen, handleClose, cbSave } = props;
  const [value, setValue] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleChange = e => {
    setValue(e.target.value);
  };

  const handleSave = () => {
    let isValidSection = null;
    if (value.trim() === '') {
      isValidSection = false;
      setErrorText("Section name isn't valid");
    } else {
      isValidSection = true;
      setErrorText('');
    }

    if (isValidSection) cbSave(value);
  };

  return (
    <Dialog
      fullWidth={true}
      open={isOpen}
      onClose={handleClose}
    >
      <DialogTitle>Create section</DialogTitle>
      <DialogContent>
        <TextField
          variant="outlined"
          placeholder="Write your new section here e.g working..."
          size="small"
          color="primary"
          fullWidth={true}
          autoFocus={true}
          value={value}
          onChange={handleChange}
          error={errorText !== ''}
          helperText={errorText}
        />
      </DialogContent>
      <DialogContent>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
        >Save</Button>{'  '}
        <Button
          variant="text"
          onClick={handleClose}
        >Cancel</Button>
      </DialogContent>
      {/* Empty DialogContent make free spacing */}
      <DialogContent></DialogContent>
    </Dialog>
  );
}

function ModalAddTask(props) {
  const { isOpen, handleClose, sectionTasks } = props;
  const classes = muiAddTaskModal();
  const [allSectionTasks, setAllSectionTasks] = useState(sectionTasks);
  const [valueTaskSection, setValueTaskSection] = useState(''); // task section value (select)
  const [valueTaskName, setValueTaskName] = useState(''); // task name value
  const [errorTaskName, setErrorTaskName] = useState(''); // error task name text
  const [openCreateSection, setOpenCreateSection] = useState(false);

  if (numberSectionTasks === null)
    numberSectionTasks = allSectionTasks.length;
  
  const handleChangeSelect = e => {
    const value = e.target.value;
    if (value === '') { // create new section
      setValueTaskSection('');
      setOpenCreateSection(true);
    } else {
      setValueTaskSection(value);
    }
  };

  const handleChangeInput = e => {
    setValueTaskName(e.target.value);
  };

  const handleSave = () => {
    let isValid = null;
    if (valueTaskName.trim() === '') {
      isValid = false;
      setErrorTaskName("Name isn't valid");
    } else {
      isValid = true;
      setErrorTaskName('');
    }

    if (isValid) {
      const newTask = {
        des: valueTaskName,
        section: valueTaskSection === '' ? null : valueTaskSection,
        schedule: null // temp
      };
      const taskAPI = new TaskAPI();
      /*await taskAPI.addTask(newTask);
      if (taskAPI.newTask) {
        // update UI
      }*/
      numberSectionTasks = null;
      handleClose();
    }
  };

  /* --- START: Handle Create Section Action --- */
  const handleCloseCreateSection = () => {
    setOpenCreateSection(false);
  };

  const cbSaveCreateSection = (sectionName) => {
    // close ModalCreateSection
    handleCloseCreateSection();

    const cloneAllSectionTasks = allSectionTasks.slice();
    cloneAllSectionTasks.push(sectionName);
    setAllSectionTasks(cloneAllSectionTasks);
    setValueTaskSection(sectionName);
  };
  /* --- END: Handle Create Section Action --- */
  return (
    <React.Fragment>
      { openCreateSection &&
          <ModalCreateSection
            isOpen={openCreateSection}
            handleClose={handleCloseCreateSection}
            cbSave={cbSaveCreateSection}
          />
      }
      <Dialog
        fullWidth={true}
        open={isOpen}
        onClose={handleClose}
        disableBackdropClick={true}
      >
        <DialogTitle>Add new task</DialogTitle>

        <DialogContent>
          <FormControl variant="outlined" size="small" fullWidth={true}>
            <InputLabel>Section</InputLabel>
            <Select
              label="Section"
              value={valueTaskSection}
              onChange={handleChangeSelect}
            >
              {/* Option creat section */}
              <MenuItem value={''}>
                <AddCircle />
                <span className={classes.addIconText}>Create new section</span>
              </MenuItem>
              {/* Option Items */}
              <MenuItem disabled><em>Your saved section</em></MenuItem>
              { allSectionTasks.map((section, index) => {
                  const key = `${section}-${index}`;
                  if (index === numberSectionTasks)
                    return [
                      <MenuItem disabled><em>Your unsaved section</em></MenuItem>,
                      <MenuItem value={section}>{section}</MenuItem>
                    ];
                  return (
                    <MenuItem key={key} value={section}>{section}</MenuItem>
                  );
              })}
            </Select>
          </FormControl>
        </DialogContent>
        
        <DialogContent>
          <TextField
            variant="outlined"
            placeholder="Write your new task here e.g check..."
            size="small"
            color="primary"
            fullWidth={true}
            autoFocus={true}
            error={errorTaskName !== ''}
            helperText={errorTaskName}
            value={valueTaskName}
            onChange={handleChangeInput}
          />
        </DialogContent>

        <DialogContent>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
          >Save</Button>{'  '}
          <Button
            variant="text"
            onClick={handleClose}
          >Cancel</Button>
        </DialogContent>
        {/* Empty DialogContent make free spacing */}
        <DialogContent></DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

function TaskHeader(props) {
  const {
    location: { pathname },
    tasks: { sectionTasks },
    addTask
  } = props;
  const gClasses = muiTaskGeneral();
  
  /* --- START: Handle Add Task Action --- */
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  /* --- END: Handle Add Task Action --- */

  return (
    <React.Fragment>
      {/* (Modal) Add Task */}
      { isOpen &&
        <ModalAddTask
          isOpen={isOpen}
          handleClose={handleClose}
          sectionTasks={sectionTasks}
          addTask={addTask}
        />
      }
      {/* Task Main Header */}
      <div className={clsx(gClasses.header, gClasses.headerMgBottom)}>
        <h1 className={gClasses.headerTitle}>
          { pathname === TASK_ALL ? 'Inbox' : 'Today' }
        </h1>
        <div>
          <Fab
            variant="extended"
            size="small"
            color="secondary"
            aria-label="add task"
            onClick={handleClickOpen}
          >
            <AddIcon />
            Add Task
          </Fab>
        </div>
      </div>
    </React.Fragment>
  );
}

function TaskHeaderUpcoming (props) {
  const gClasses = muiTaskGeneral();
  const defineDate = new Date(); // will set later
  const [indexActiveWeekRow, setIndexActiveWeekRow] = useState(null);
  const [weekRow, setWeekRow] = useState([]);

  const handleChangeTabList = (e, newValue) => setIndexActiveWeekRow(newValue);

  useEffect(() => {
    const week = getWeekByDate(defineDate);
    if (week && week.length > 0) {
      let activeIndex = null;
      const weekRow = week.map((date, index) => {
        const day = date.getDay();
        if (day === defineDate.getDay()) {
          activeIndex = index;
          setIndexActiveWeekRow(activeIndex);
        }
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
      setWeekRow(weekRow);
    }
  }, []);
  
  return (
    <div className={gClasses.headerMgBottomL}>
      <div className={clsx(gClasses.header, gClasses.headerMgBottom)}>
        <h1 className={gClasses.headerTitle}>
          { defineDate.getDate() }
        </h1>
        <div>Button</div>
      </div>
      <div>
        {/* Tab list week row */}
        <Paper square>
          <Tabs
            value={indexActiveWeekRow}
            onChange={handleChangeTabList}
            variant="fullWidth"
            indicatorColor="secondary"
            textColor="secondary"
          >
            { weekRow.map(({ dayString, date, month, year, isDisabled }) =>
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
            )}
          </Tabs>
        </Paper>
      </div>
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

  const [expanded, setExpanded] = useState(false);

  const handleChangeExpand = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // check every time user switch other tab
  if (prevPathNameTask !== null && prevPathNameTask !== pathname) {
    console.log('prevPathname: ', prevPathNameTask);
    if (prevEditTask !== null) {
      const { obIndex: { parentIndex, childIndex }} = prevEditTask;
      const { taskDataProperty } = checkCurrentPathname(prevPathNameTask);
      
      const cloneTask = tasks[taskDataProperty].slice();
      const prevTask = cloneTask[parentIndex].items[childIndex];
      prevTask.originDes = prevTask.des;
      prevTask.isOpen = false;
      
      setTask({
        ...tasks,
        [taskDataProperty]: cloneTask
      });
      prevEditTask = null;
    }
    //numberSectionTasks = null;
  }
  prevPathNameTask = pathname;
  
  const startOpenEditTask = (obIndex) => {
    const cloneTask = tasks[taskDataProperty].slice();
    // get current Task
    const { parentIndex, childIndex } = obIndex;
    const curTask = cloneTask[parentIndex].items[childIndex];

    if (prevEditTask !== null) {
      const {
        obIndex: {
          parentIndex: prevParentIndex,
          childIndex: prevChildIndex
        }
      } = prevEditTask;
      
      // get prev Task
      const prevTask = cloneTask[prevParentIndex].items[prevChildIndex];
      // set Task
      prevTask.des = prevTask.originDes;
      prevTask.isOpen = false;
    }
    curTask.isOpen = true;
    setTask({ ...tasks, [taskDataProperty]: cloneTask });
    prevEditTask = { obIndex };
  };

  const updateDesTask = async (obIndex, taskOb) => {
    prevEditTask = null;
    const taskAPI = new TaskAPI();
    const token = getCookie('emailToken');
    await taskAPI.updateTask(token, taskOb);
    if (taskAPI.isUpdateSuccess) {
      // change UI after success
      const { parentIndex, childIndex } = obIndex;
      const cloneTask = tasks[taskDataProperty].slice();
      const curTask = cloneTask[parentIndex].items[childIndex];
      // set current isOpen status and update originDes
      curTask.originDes = curTask.des;
      curTask.isOpen = false;
      // find other clone Task and update
      const otherCloneTask = updateCloneTaskItemUI(tasks, taskDataProperty, curTask);
      setTask({ 
        ...tasks,
        [taskDataProperty]: cloneTask,
        ...otherCloneTask
      });
    } else {
      // fail
      alert('update fail');
    }
  }

  const startCloseEditStart = (obIndex) => {
    const { parentIndex, childIndex } = obIndex;
    const cloneTask = tasks[taskDataProperty].slice();
    const curTask = cloneTask[parentIndex].items[childIndex];
    // set current isOpen status
    curTask.des = curTask.originDes;
    curTask.isOpen = false;
    setTask({ ...tasks, [taskDataProperty]: cloneTask });
  };

  return (
    <Box>
      {/* Task Main List */}
      <div className={gClasses.wrapperAllSection}>
        {tasks[taskDataProperty].map(({ section, items }, index) => {
          const parentIndex = index;
          const panelName = `panel-${taskClassName}-${parentIndex}`;
          return (
            <ExpansionPanel
              // TransitionProps={{ unmountOnExit: true }}
              key={`${taskIdName}${parentIndex}`}
              className={clsx(taskClassName, gClasses.section)}
              //expanded={expanded === panelName}
              //onChange={handleChangeExpand(panelName)}
            >
              <ExpansionPanelSummary
                className={clsx(`${taskClassName}-header`, gClasses.sectionHeader)}
                expandIcon={<ExpandMore />}
              >
                { section }
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
        <Fab
            variant="round"
            size="small"
            color="secondary"
            aria-label="add"
          >
            <AddIcon />
          </Fab>
      </div>
    </Box>
  );
}

// TaskWrapper Component for Route
function TaskWrapper (props) {
  return (
    <React.Fragment>
      <TaskHeader {...props} />
      <TaskList {...props} />
    </React.Fragment>
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

  const TaskSection = (props) => {
    // routerProps: props from Route
    // taskMainProps: props from TaskMain
    const routerProps = props;
    const allProps = { ...routerProps, ...taskMainProps };
    return (
      <React.Fragment>
        <TaskHeader {...allProps} />
        <TaskList {...allProps} />
      </React.Fragment>
    );
  }

  const TaskUpcoming = (props) => {
    // routerProps: props from Route
    // taskMainProps: props from TaskMain
    const routerProps = props;
    const allProps = { ...routerProps, ...taskMainProps };
    return (
      <React.Fragment>
        <TaskHeaderUpcoming {...allProps} />
        <TaskList {...allProps} />
      </React.Fragment>
    );
  }
  
  if (!tasks.fetchDone) return <div>Loading...</div>;
  return (
    <div className="task-main">
      <Switch>
        <Route exact path={TASK_ALL} render={props => <TaskWrapper {...props} {...taskMainProps} />} />
        <Route path={TASK_TODAY} render={props => <TaskWrapper {...props} {...taskMainProps} />} />
        <Route path={TASK_UPCOMING} render={props => <TaskWrapper {...props} {...taskMainProps} />} />
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
