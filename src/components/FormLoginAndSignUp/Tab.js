import React from "react";
import PropTypes from "prop-types";
import { Tabs, Tab, ThemeProvider, createMuiTheme } from "@material-ui/core";
import { muiTabs, muiTab } from "./styled";

function TabForm(props) {
  const { value, handleChange, ...other } = props;

  const a11yProps = index => ({
    id: `form-tab-${index}`,
    "aria-controls": `form-tabpanel-${index}`
  });

  const customTheme = createMuiTheme({
    palette: {
      myColor: "red"
    }
  });

  return (
    <ThemeProvider theme={customTheme}>
      <Tabs
        value={value}
        onChange={handleChange}
        classes={muiTabs()}
        variant="fullWidth"
        aria-label="form-tabs-header"
        {...other}
      >
        <Tab label="ALREADY MEMBER ?" classes={muiTab()} {...a11yProps(0)} />
        <Tab label="NEW MEMBER ?" classes={muiTab()} {...a11yProps(1)} />
      </Tabs>
    </ThemeProvider>
  );
}

TabForm.propTypes = {
  value: PropTypes.any.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default TabForm;
