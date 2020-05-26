import React from 'react';
import PropTypes from 'prop-types';

import { Tabs, Tab } from '@material-ui/core';
import { muiTab, muiForm } from './styled';

function FormTabHeader(props) {
  const classes = muiForm(); // use style from makeStyles
  const { value, handleChange, ...other } = props;

  const a11yProps = index => ({
    id: `form-tab-${index}`,
    'aria-controls': `form-tabpanel-${index}`
  });

  return (
    <div className={classes.wrapperHeader}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        aria-label="form-tabs-header"
        {...other}
      >
        <Tab label="ALREADY MEMBER ?" classes={muiTab()} {...a11yProps(0)} />
        <Tab label="NEW MEMBER ?" classes={muiTab()} {...a11yProps(1)} />
      </Tabs>
    </div>
  );
}

FormTabHeader.propTypes = {
  value: PropTypes.any.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default FormTabHeader;
