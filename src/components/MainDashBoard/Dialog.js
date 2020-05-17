import React, { Fragment, useState } from 'react';
// Task API Class
import TaskAPI from '../../apis/task';

// Styling
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import { AddCircle } from '@material-ui/icons';
import { red } from '@material-ui/core/colors';
import { muiModal } from './styled';

import { DatePicker, TimePicker } from '@material-ui/pickers';

let numberSectionTasks = null; // use for render select section

export function ModalCreateSection (props) {
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

export function ModalAddTask (props) {
  const { isOpen, handleClose, sectionTasks } = props;
  const classes = muiModal();
  const [allSectionTasks, setAllSectionTasks] = useState(sectionTasks);
  const [valueTaskSection, setValueTaskSection] = useState(''); // task section value (select)
  const [valueTaskName, setValueTaskName] = useState(''); // task name value
  const [errorTaskName, setErrorTaskName] = useState(''); // error task name text
  const [selectedDate, setSelectedDate] = useState(new Date()); // set select schedule date
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

  const handleDateChange = (date) => {
    setSelectedDate(date);
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
    <Fragment>
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
          <DatePicker
            variant="inline"
            label="Schedule date"
            inputVariant="outlined"
            size="small"
            value={selectedDate}
            onChange={handleDateChange}
          />
          <TimePicker
            variant="inline"
            label="Schedule time"
            inputVariant="outlined"
            size="small"
            //value={selectedDate}
            //onChange={handleDateChange}
          />
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
            onChange={handleDateChange}
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
    </Fragment>
  );
}

export function ModalConFirm (props) {
  const { isOpen, handleClose, removeTask } = props;
  const classes = muiModal();
  return (
    <Dialog
      fullWidth={true}
      open={isOpen}
      onClose={handleClose}
    >
      <DialogTitle
        className={classes.borderDialogTitle}
        style={{ color: red[500] }}>
        Are you sure delete task ?
      </DialogTitle>
      <DialogContent>
        <Button
          variant="contained"
          className={classes.deleteButton}
          onClick={removeTask}
        >
          Delete 
        </Button>{'  '}
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