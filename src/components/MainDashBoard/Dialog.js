import React, { Fragment, useState } from 'react';
import clsx from 'clsx';

import { keys } from '../../constants/task';
import { TASK_TODAY, TASK_UPCOMING } from '../../constants/location';
import { SCHEDULE_DATE } from '../../constants/schedule';

import {
  getSuggestScheduleDate,
  getScheduleText,
  monthNames,
} from '../../utils/time';

// Task API Class
import TaskAPI from '../../apis/task';
import SectionAPI from '../../apis/section';

// Styling
import { red } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/styles';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import {
  AddCircle as AddCircleIcon,
  Today as TodayIcon,
  WbSunnyOutlined as WbSunnyOutlinedIcon,
  ArrowRightAlt as ArrowRightAltIcon,
  NotInterested as NotInterestedIcon,
  InfoOutlined as InfoIcon,
} from '@material-ui/icons';
import {
  muiModal,
  muiMenuItemModal,
  muiSelectSchedule,
  muiDateTimePicker,
  muiTaskGeneral,
} from './styled';
import { DateTimePicker } from '@material-ui/pickers';

function getCloneTaskAfterAddSection(tasks, newSection) {
  const sectionTasks = tasks.sectionTasks.slice();
  sectionTasks[0].push(newSection.section);
  sectionTasks[1].push(newSection._id);
  const tasksInbox = { ...tasks.tasksInbox };
  tasksInbox[newSection._id] = newSection;
  tasksInbox[newSection._id].items = {};
  return {
    ...tasks,
    tasksInbox,
    sectionTasks,
  };
}

function getCloneTaskAfterAfterAddTask(
  tasks,
  { newTask, scheduleText, tasksUpcomingMatchIndex }
) {
  let result = { ...tasks };
  const { nullSectionKey, todayKey, upcomingKey } = keys;
  const { schedule, section, _id } = newTask;
  newTask.isOpen = false;
  newTask.scheduleText = scheduleText;

  // create section null
  if (section === null) {
    if (!result.tasksInbox[nullSectionKey]) {
      result.tasksInbox[nullSectionKey] = {
        _id: '0',
        section: null,
        order: 0,
        items: {},
      };
    }
    result.tasksInbox[nullSectionKey].items[_id] = newTask;
  }

  // Today Task
  if (schedule !== null && scheduleText === SCHEDULE_DATE.today) {
    const todaySection = result.tasksToday[todayKey];
    if (!todaySection.items) todaySection.items = {};
    todaySection.items[_id] = newTask;
  }

  // Inbox Task
  if (section !== null) {
    const parentTaskSection = result.tasksInbox[section];
    if (!parentTaskSection.items) parentTaskSection.items = {};
    parentTaskSection.items[_id] = newTask;
  }

  // Upcoming Task
  const tasksUpcoming = Object.values(result.tasksUpcoming);
  if (scheduleText !== '') {
    if (tasksUpcomingMatchIndex !== -1) {
      tasksUpcoming[tasksUpcomingMatchIndex].items[_id] = newTask;
    } else {
      const order = tasksUpcoming.length + 1;
      const key = `${upcomingKey}${order}`;
      result.tasksUpcoming[key] = {
        _id: key,
        section: scheduleText,
        order,
        items: { [_id]: newTask },
      };
    }
  }
  console.log('result: ', result);
  return result;
}

export function ModalCreateSection(props) {
  const { isOpen, handleClose, cbSave } = props;
  const [value, setValue] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleChange = (e) => setValue(e.target.value);

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
    <Dialog fullWidth={true} open={isOpen} onClose={handleClose}>
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
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        {'  '}
        <Button variant="text" onClick={handleClose}>
          Cancel
        </Button>
      </DialogContent>
      {/* Empty DialogContent make free spacing */}
      <DialogContent></DialogContent>
    </Dialog>
  );
}

export function ModalAddTask(props) {
  const {
    isOpen,
    handleClose,
    tasks,
    location: { pathname },
    setTask,
    activeDate,
  } = props;
  const gClasses = muiTaskGeneral();
  const classes = muiModal();
  const menuItemClasses = muiMenuItemModal();
  const selectScheduleClasses = muiSelectSchedule();

  function chooseDefaultValueTasksSchedule() {
    if (pathname === TASK_TODAY) return 'today';
    if (pathname === TASK_UPCOMING) return 'choosedate';
    return 'nodate';
  }

  const [valueTaskSection, setValueTaskSection] = useState(''); // task section value (select)
  const [valueTaskSchedule, setValueTaskSchedule] = useState(
    chooseDefaultValueTasksSchedule()
  ); // task schedule value (select)

  const [switchScheduleType, setSwitchScheduleType] = useState(false);

  const [valueTaskName, setValueTaskName] = useState(''); // task name text
  const [errorTaskName, setErrorTaskName] = useState(''); // error task name text

  // select schedule date
  const curDate = new Date();
  curDate.setHours(0, 0, 0, 0);
  const [selectedDate, setSelectedDate] = useState(curDate);

  const [isOpenCalendar] = useState(false);
  const suggestDate = getSuggestScheduleDate({ inputDate: curDate });
  const [openCreateSection, setOpenCreateSection] = useState(false);

  const handleChangeSelectSection = (e) => {
    const value = e.target.value;
    if (value === 'create') {
      // create new section
      setValueTaskSection('');
      setOpenCreateSection(true);
    } else {
      setValueTaskSection(value);
    }
  };

  const handleChangeSelectSchedule = (e) =>
    setValueTaskSchedule(e.target.value);

  const handleChangeSwitch = (e) => setSwitchScheduleType(e.target.checked);

  const handleValueTaskName = (e) => setValueTaskName(e.target.value);

  const handleSave = async () => {
    let isValid = null;
    if (valueTaskName.trim() === '') {
      isValid = false;
      setErrorTaskName("Name isn't valid");
    } else {
      isValid = true;
      setErrorTaskName('');
    }

    if (isValid) {
      let section = null;
      let schedule = null;
      let index = {
        bySection: -1,
        byToday: -1,
        byUpcoming: -1,
      };

      const getIndexOrder = (key, taskType) => {
        const items = Object.values(tasks[taskType][key].items);
        return items.length;
      };

      let cloneTasks = { ...tasks };
      let arrItemArrange = [];
      function handleArrangeItemOrder({ key, taskType, byOrder }, indexOrder) {
        const items = Object.values(tasks[taskType][key].items);
        items.sort((a, b) => a.index[byOrder] - b.index[byOrder]);
        const lastItem = items[items.length - 1];

        if (lastItem && lastItem.index[byOrder] >= indexOrder) {
          for (let index = 0; index < items.length; index++) {
            const task = items[index]; // item
            if (task.index[byOrder] !== index) {
              cloneTasks[taskType][key].items[task._id].index[byOrder] = index;
              arrItemArrange.push({
                _id: task._id,
                index: {
                  ...task.index,
                  [byOrder]: index,
                },
              });
            }
          }
        }
      }

      if (switchScheduleType) {
        // set schedule
        schedule = selectedDate.toJSON();
      } else {
        // quick schedule
        if (pathname === TASK_UPCOMING) {
          const { month, date, year } = activeDate;
          schedule = new Date(`${year}-${month}-${date}`).toJSON();
        } else {
          const suggest = suggestDate[valueTaskSchedule];
          if (suggest !== null) schedule = suggest.toJSON();
          else schedule = null;
        }
      }

      // section name
      if (valueTaskSection === '') {
        section = null;
        // by section
        if (!tasks.tasksInbox['0']) {
          index.bySection = 0;
        } else {
          const indexOrder = getIndexOrder('0', 'tasksInbox');
          index.bySection = indexOrder;
          handleArrangeItemOrder(
            {
              key: '0',
              taskType: 'tasksInbox',
              byOrder: 'bySection',
            },
            indexOrder
          );
        }
      } else {
        section = valueTaskSection;
        // by section
        const indexOrder = getIndexOrder(section, 'tasksInbox');
        index.bySection = indexOrder;
        handleArrangeItemOrder(
          {
            key: section,
            taskType: 'tasksInbox',
            byOrder: 'bySection',
          },
          indexOrder
        );
      }

      const scheduleText = getScheduleText(schedule);
      let tasksUpcomingMatchIndex = -1;
      if (scheduleText !== '') {
        if (scheduleText === SCHEDULE_DATE.today) {
          // byToday
          const indexOrder = getIndexOrder('today', 'tasksToday');
          index.byToday = indexOrder;
          handleArrangeItemOrder(
            {
              key: 'today',
              taskType: 'tasksToday',
              byOrder: 'byToday',
            },
            indexOrder
          );
        }
        // byUpcoming
        const tasksUpcoming = Object.values({ ...tasks.tasksUpcoming });
        for (let i = 0; i < tasksUpcoming.length; i++) {
          const s = tasksUpcoming[i];
          if (s.section === scheduleText) {
            tasksUpcomingMatchIndex = i;
            const indexOrder = getIndexOrder(s._id, 'tasksUpcoming');
            index.byUpcoming = indexOrder;
            handleArrangeItemOrder(
              {
                key: s._id,
                taskType: 'tasksUpcoming',
                byOrder: 'byUpcoming',
              },
              indexOrder
            );
            break;
          }
        }
        if (tasksUpcomingMatchIndex === -1) index.byUpcoming = 0;
      }

      async function addTask() {
        const newTask = {
          des: valueTaskName,
          section,
          schedule,
          index,
        };
        const taskAPI = new TaskAPI();
        await taskAPI.addTask(newTask);
        if (taskAPI.newTask) {
          // update UI
          const result = getCloneTaskAfterAfterAddTask(cloneTasks, {
            newTask: taskAPI.newTask,
            scheduleText,
            tasksUpcomingMatchIndex,
          });
          setTask(result);
        } else {
          alert('add Task fail');
        }
      }

      if (arrItemArrange.length > 0) {
        // arrange dirty index first
        console.log('arrItemArrange: ', arrItemArrange);
        const taskAPI = new TaskAPI();
        await taskAPI.updateManyTask(arrItemArrange);
        if (taskAPI.isUpdateManySuccess) addTask();
        else alert('pre - add Task fail');
      } else {
        addTask();
      }

      handleClose(); // close Modal
    }
  };

  /* --- START: Handle Create Section Action --- */
  const handleCloseCreateSection = () => setOpenCreateSection(false);

  const cbSaveCreateSection = async (sectionName) => {
    // close ModalCreateSection
    handleCloseCreateSection();

    const sectionAPI = new SectionAPI();
    const order = tasks.sectionTasks[0].length;
    await sectionAPI.addSection({
      section: sectionName,
      order,
    });
    if (sectionAPI.isAddSuccess && sectionAPI.dataAfterAdd) {
      // update UI
      const newSection = sectionAPI.dataAfterAdd;
      setTask(getCloneTaskAfterAddSection(tasks, newSection));
      setValueTaskSection(newSection._id);
    } else {
      alert('add Section fail');
    }
  };
  /* --- END: Handle Create Section Action --- */

  const renderSelectSchedule = () => {
    if (pathname === TASK_UPCOMING) {
      const { dayString, month, date, year } = activeDate;
      return (
        <Select
          label="Schedule"
          classes={selectScheduleClasses}
          value={valueTaskSchedule}
          onChange={handleChangeSelectSchedule}
          open={false}
        >
          <MenuItem value={'choosedate'}>{`${dayString} ${
            monthNames[month - 1]
          } ${date} ${year}`}</MenuItem>
        </Select>
      );
    }
    return (
      <Select
        label="Schedule"
        classes={selectScheduleClasses}
        value={valueTaskSchedule}
        onChange={handleChangeSelectSchedule}
      >
        <MenuItem disabled>Choose quick schedule</MenuItem>
        <MenuItem classes={menuItemClasses} value={'today'}>
          <div>
            <TodayIcon fontSize="small" />
            <span>Today</span>
          </div>
          <span>{suggestDate.today.toDateString()}</span>
        </MenuItem>
        <MenuItem classes={menuItemClasses} value={'tomorrow'}>
          <div>
            <WbSunnyOutlinedIcon fontSize="small" />
            <span>Tomorrow</span>
          </div>
          <span>{suggestDate.tomorrow.toDateString()}</span>
        </MenuItem>
        <MenuItem classes={menuItemClasses} value={'nextweek'}>
          <div>
            <ArrowRightAltIcon fontSize="small" />
            <span>Next week</span>
          </div>
          <span>{suggestDate.nextweek.toDateString()}</span>
        </MenuItem>
        <MenuItem value={'nodate'}>
          <div>
            <NotInterestedIcon fontSize="small" />
            <span className={gClasses.gapLeft}>No date</span>
          </div>
        </MenuItem>
      </Select>
    );
  };

  return (
    <Fragment>
      {openCreateSection && (
        <ModalCreateSection
          isOpen={openCreateSection}
          handleClose={handleCloseCreateSection}
          cbSave={cbSaveCreateSection}
        />
      )}
      <Dialog
        scroll="paper"
        fullWidth={true}
        open={isOpen}
        onClose={handleClose}
        disableBackdropClick={true}
        className={classes.modalRoot}
      >
        <DialogTitle>Add Task</DialogTitle>

        {/* Switch */}
        <DialogContent className={classes.gutterTopBottom}>
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={switchScheduleType}
                onChange={handleChangeSwitch}
              />
            }
            label="Switch to set your schedule"
          />
        </DialogContent>

        {/* Select section */}
        <DialogContent>
          <FormControl variant="outlined" size="small" fullWidth={true}>
            <InputLabel>Section</InputLabel>
            <Select
              label="Section"
              value={valueTaskSection}
              onChange={handleChangeSelectSection}
            >
              {/* Option creat section */}
              <MenuItem value={'create'}>
                <AddCircleIcon />
                <span className={clsx(gClasses.gapLeft, gClasses.fontBold)}>
                  Create new section
                </span>
              </MenuItem>

              {/* Option Items */}
              {tasks.sectionTasks[0].map((section, index) => {
                const key = tasks.sectionTasks[1][index];
                if (section === null) return null;
                return (
                  <MenuItem key={key} value={key}>
                    {section}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </DialogContent>

        {/* Select schedule and Datetime picker */}
        <DialogContent>
          {switchScheduleType ? (
            <ThemeProvider theme={muiDateTimePicker}>
              <DateTimePicker
                autoOk
                size="small"
                variant="static"
                openTo="date"
                minDate={curDate}
                open={isOpenCalendar}
                value={selectedDate}
                onChange={setSelectedDate}
              />
            </ThemeProvider>
          ) : (
            <FormControl variant="outlined" size="small" fullWidth={true}>
              <InputLabel>Schedule</InputLabel>
              {renderSelectSchedule()}
            </FormControl>
          )}
        </DialogContent>

        {/* Input task name */}
        <DialogContent>
          <TextField
            variant="outlined"
            placeholder="Write your new task here e.g check..."
            color="primary"
            fullWidth={true}
            autoFocus={true}
            error={errorTaskName !== ''}
            helperText={errorTaskName}
            value={valueTaskName}
            onChange={handleValueTaskName}
          />
        </DialogContent>

        {/* Button group */}
        <DialogContent>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          {'  '}
          <Button variant="text" onClick={handleClose}>
            Cancel
          </Button>
        </DialogContent>

        {/* Empty DialogContent make free spacing */}
        <DialogContent></DialogContent>
      </Dialog>
    </Fragment>
  );
}

export function ModalConFirm(props) {
  const { isOpen, handleClose, removeTask, des } = props;
  const gClasses = muiTaskGeneral();
  const classes = muiModal();

  return (
    <Dialog fullWidth={true} open={isOpen} onClose={handleClose}>
      <DialogTitle
        className={classes.borderDialogTitle}
        style={{ color: red[500] }}
      >
        <InfoIcon />
        <span className={gClasses.gapLeft}>
          Are you sure you want to delete{' '}
          <span className={clsx(gClasses.fontBold, gClasses.fontItalic)}>
            {des}
          </span>
        </span>
      </DialogTitle>
      <DialogActions>
        <Button
          variant="contained"
          className={classes.deleteButton}
          onClick={removeTask}
        >
          Delete
        </Button>
        {'  '}
        <Button variant="text" onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
      {/* Empty DialogContent make free spacing */}
      <DialogContent></DialogContent>
    </Dialog>
  );
}
