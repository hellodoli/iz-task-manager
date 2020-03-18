import React, { useState } from 'react';

import { Paper } from '@material-ui/core';
import { muiForm } from './styled';

// Components
import FormTabHeader from './FormTabHeader';
import TabPanel from './TabPanel';
import FormSignIn from './FormSignIn';

function FormLoginAndSignUp(props) {
  const classes = muiForm();
  const [value, setValue] = useState(0);

  // handle value Tab, TabPanel
  const handleChangeTabValue = (event, value) => setValue(value);

  return (
    <div className={classes.wrapperFixed}>
      <Paper square className={classes.wrapperContainer}>
        {/* Form tab */}
        <FormTabHeader value={value} handleChange={handleChangeTabValue} />
        {/* Form tab panel */}
        <div>
          <TabPanel value={value} index={0}>
            <FormSignIn />
          </TabPanel>
          <TabPanel value={value} index={1}>
            Item 2
          </TabPanel>
        </div>
      </Paper>
    </div>
  );
}

export default FormLoginAndSignUp;
