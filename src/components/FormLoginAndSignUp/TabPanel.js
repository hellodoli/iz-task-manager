import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Box } from '@material-ui/core';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  const getAttrTabpanel = (index) => ({
    id: `form-tabpanel-${index}`,
    'aria-labelledby': `form-tab-${index}`,
  });

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      {...getAttrTabpanel(index)}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default TabPanel;
