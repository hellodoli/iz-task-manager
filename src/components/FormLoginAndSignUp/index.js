import React, { useState } from 'react';
import clsx from 'clsx';
import { Container, Paper } from '@material-ui/core';
import { muiForm } from './styled';

// Components
import FormTabHeader from './FormTabHeader';
import TabPanel from './TabPanel';
import FormSignIn from './FormSignIn';
import FormSignUp from './FormSignUp';

import { showLoading } from '../../actions/loading';
import { useDispatch } from 'react-redux';

function FormLoginAndSignUp() {
  const dispatch = useDispatch();
  const classes = muiForm();
  const [value, setValue] = useState(0);

  // handle value Tab, TabPanel (để show tab)
  const handleChangeTabValue = (event, value) => setValue(value);

  return (
    <div className={classes.wrapperFixed}>
      <Container className={classes.wrapperContainerParent}>
        <Paper
          square
          className={clsx(
            classes.wrapperContainer,
            classes.wrapperBorderRadius
          )}
          elevation={10}
        >
          {/* Form tab */}
          <FormTabHeader value={value} handleChange={handleChangeTabValue} />
          {/* Form tab panel */}
          <div>
            <TabPanel value={value} index={0}>
              <FormSignIn />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <FormSignUp />
            </TabPanel>
          </div>

          <button onClick={() => dispatch(showLoading())}>Test render</button>
        </Paper>
      </Container>
    </div>
  );
}

export default FormLoginAndSignUp;
