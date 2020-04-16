import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TASK_ALL, TASK_TODAY, TASK_OTHER } from '../../constants/location';
import { getTask } from '../../actions/task';

import { muiTaskGeneral, muiTaskItem } from './styled';

function renderSchedule(schedule) {
  let scheduleText = '';
  // ...
  return scheduleText;
}

function TaskItem({ des, schedule, section, subtasks, completed }) {
  const classes = muiTaskItem();
  return (
    <div className={classes.wrapperItem}>
      <div>{des}</div>
    </div>
  );
}

function TaskWithSection({ tasks }) {
  return (
    <div>
      {tasks.length > 0 &&
        tasks.map(task => <TaskItem key={task._id} {...task} />)}
    </div>
  );
}

function TaskMain(props) {
  const { location, tasks, getTask } = props;
  const pathname = location.pathname;
  const gClasses = muiTaskGeneral();
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
    if (pathname === TASK_ALL) return <TaskWithSection tasks={tasks} />;
    return null;
  };

  const classes = muiTaskItem();
  return (
    <div>
      <header className={gClasses.wrapperHeader}>
        <h1 className={gClasses.wrapperHeaderTitle}>{renderHeader()}</h1>
      </header>
      {/* render Tasks Main */}
      <div></div>
      {/* demo */}
      <div className={classes.wrapperItem}>
        <div className={classes.wrapperItemDetail}>
          <div>checker</div>
          <div className={classes.wrapperItemContent}>
            <div>Some thing to dos</div>
            <div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
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
