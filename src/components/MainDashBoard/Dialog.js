import React, { Fragment, useState } from 'react';
import clsx from 'clsx';
import { TASK_TODAY } from '../../constants/location';
import { getSuggestScheduleDate } from '../../utils/time';
// Task API Class
import TaskAPI from '../../apis/task';

// Styling
import { red } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/styles';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch
} from '@material-ui/core';
import {
  AddCircle as AddCircleIcon,
  Today as TodayIcon,
  WbSunnyOutlined as WbSunnyOutlinedIcon,
  ArrowRightAlt as ArrowRightAltIcon,
  NotInterested as NotInterestedIcon
} from '@material-ui/icons';
import {
  muiModal,
  muiMenuItemModal,
  muiSelectSchedule,
  muiDateTimePicker
} from './styled';
import { DateTimePicker } from '@material-ui/pickers';

let numberSectionTasks = null; // use for render select section

export function ModalCreateSection(props) {
  const { isOpen, handleClose, cbSave } = props;
  const [value, setValue] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleChange = e => setValue(e.target.value);

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
  const { isOpen, handleClose, sectionTasks, pathname } = props;
  const classes = muiModal();
  const menuItemClasses = muiMenuItemModal();
  const selectScheduleClasses = muiSelectSchedule();

  const [allSectionTasks, setAllSectionTasks] = useState(sectionTasks);
  const [valueTaskSection, setValueTaskSection] = useState(''); // task section value (select)
  const [valueTaskSchedule, setValueTaskSchedule] = useState(
    pathname === TASK_TODAY ? 'today' : 'nodate'
  ); // task schedule value (select)

  const [switchScheduleType, setSwitchScheduleType] = useState(false);

  const [valueTaskName, setValueTaskName] = useState(''); // task name text
  const [errorTaskName, setErrorTaskName] = useState(''); // error task name text

  // select schedule date
  const curDate = new Date();
  curDate.setHours(0, 0, 0, 0);
  const [selectedDate, setSelectedDate] = useState(curDate);

  const [isOpenCalendar] = useState(false);
  const suggestDate = getSuggestScheduleDate(curDate);
  const [openCreateSection, setOpenCreateSection] = useState(false);

  if (numberSectionTasks === null) numberSectionTasks = allSectionTasks.length;

  const handleChangeSelectSection = e => {
    const value = e.target.value;
    if (value === 'create') {
      // create new section
      setValueTaskSection('');
      setOpenCreateSection(true);
    } else {
      setValueTaskSection(value);
    }
  };

  const handleChangeSelectSchedule = e => setValueTaskSchedule(e.target.value);

  const handleChangeSwitch = e => setSwitchScheduleType(e.target.checked);

  const handleValueTaskName = e => setValueTaskName(e.target.value);

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
      const newTask = {
        des: valueTaskName,
        section: valueTaskSection === '' ? null : valueTaskSection,
        schedule: switchScheduleType
          ? selectedDate.toJSON() // set schedule
          : suggestDate[valueTaskSchedule] !== null // quick schedule
          ? suggestDate[valueTaskSchedule].toJSON()
          : null
      };

      const taskAPI = new TaskAPI();
      await taskAPI.addTask(newTask);
      if (taskAPI.newTask) {
        // update UI
      } else {
        alert('add Task fail');
      }
      numberSectionTasks = null;
      handleClose(); // close Modal
    }
  };

  const handleCloseModalAddTask = () => {
    numberSectionTasks = null;
    handleClose();
  };

  /* --- START: Handle Create Section Action --- */
  const handleCloseCreateSection = () => setOpenCreateSection(false);

  const cbSaveCreateSection = sectionName => {
    // close ModalCreateSection
    handleCloseCreateSection();

    const cloneAllSectionTasks = allSectionTasks.slice();
    cloneAllSectionTasks.push(sectionName);
    setAllSectionTasks(cloneAllSectionTasks);
    setValueTaskSection(sectionName);
  };
  /* --- END: Handle Create Section Action --- */

  const renderSavedOptionSection = () => {
    if (sectionTasks.length > 0) {
      if (sectionTasks.length === 1 && sectionTasks[0] === null) return null;
      return (
        <MenuItem disabled>
          <em>Your saved section</em>
        </MenuItem>
      );
    }
    return null;
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
        fullWidth={true}
        open={isOpen}
        onClose={handleCloseModalAddTask}
        disableBackdropClick={true}
      >
        <DialogTitle>Add new task</DialogTitle>

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
                <span
                  className={clsx(
                    classes.textOptionWithIcon,
                    classes.textOptionWithIconI
                  )}
                >
                  Create new section
                </span>
              </MenuItem>

              {renderSavedOptionSection()}

              {/* Option Items */}
              {allSectionTasks.map((section, index) => {
                if (section === null) return null;
                const key = `${section}-${index}`;
                if (index === numberSectionTasks) {
                  return [
                    <MenuItem disabled>
                      <em>Your unsaved section</em>
                    </MenuItem>,
                    <MenuItem value={section}>{section}</MenuItem>
                  ];
                }
                return (
                  <MenuItem key={key} value={section}>
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
              <Select
                label="Schedule"
                value={valueTaskSchedule}
                onChange={handleChangeSelectSchedule}
                classes={selectScheduleClasses}
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
                  <NotInterestedIcon fontSize="small" />
                  <span className={classes.textOptionWithIcon}>No date</span>
                </MenuItem>
              </Select>
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
  const { isOpen, handleClose, removeTask } = props;
  const classes = muiModal();
  return (
    <Dialog fullWidth={true} open={isOpen} onClose={handleClose}>
      <DialogTitle
        className={classes.borderDialogTitle}
        style={{ color: red[500] }}
      >
        Are you sure delete task ?
      </DialogTitle>
      <DialogContent>
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
      </DialogContent>
      {/* Empty DialogContent make free spacing */}
      <DialogContent></DialogContent>
    </Dialog>
  );
}
