import React, { useState } from "react";
import PropTypes from "prop-types";

import User from "../../apis/user";

import {
  Paper,
  Tabs,
  Tab,
  Typography,
  Box,
  FormControl,
  InputLabel,
  TextField,
  OutlinedInput
} from "@material-ui/core";
import {
  FormWrapperFixedCenter,
  FormWrapper,
  FormWrapperHeader,
  // MaterialUI makeStyles
  muiTabs,
  muiTab
} from "./styled";

// unique key
const usernameInput = "username";
const passwordInput = "password";

// TabPanel is tab-body holder
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`form-tabpanel-${index}`}
      aria-labelledby={`form-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function FormSignIn() {
  const [values, setValues] = useState({
    password: "",
    isShowPassword: false
  });

  const handleChange = (event, prop) => {
    setValues({
      ...values,
      [prop]: event.target.value
    });
  };

  return (
    <div>
      <form noValidate autoComplete="off">
        <TextField fullWidth label="Outlined" variant="outlined" />
        <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password-signin">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password-signin"
            value={values.password}
            type={values.isShowPassword ? "text" : "password"}
            onChange={e => handleChange(e, "password")}
          ></OutlinedInput>
          <div>{values.password}</div>
        </FormControl>
        <TextField fullWidth label="Outlined" variant="outlined" />
      </form>
    </div>
  );
}

function FormTab() {
  const [value, setValue] = useState(0);

  const handleChange = (event, value) => {
    setValue(value);
  };

  const a11yProps = index => ({
    id: `form-tab-${index}`,
    "aria-controls": `form-tabpanel-${index}`
  });

  return (
    <Paper square>
      {/* Form tab header */}
      <FormWrapperHeader>
        <Tabs
          value={value}
          onChange={handleChange}
          centered={true}
          aria-label="form-tabs-header"
          classes={muiTabs()}
        >
          <Tab label="ALREADY MEMBER ?" classes={muiTab()} {...a11yProps(0)} />
          <Tab label="NEW MEMBER ?" classes={muiTab()} {...a11yProps(1)} />
        </Tabs>
      </FormWrapperHeader>
      {/* Form tab body */}
      <div>
        <TabPanel value={value} index={0}>
          <FormSignIn />
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item 2
        </TabPanel>
      </div>
    </Paper>
  );
}

function FormLoginAndSignUp() {
  const [input, setInput] = useState({
    [usernameInput]: "",
    [passwordInput]: ""
  });

  const [user] = useState(new User());

  function onSubmit(e) {
    e.preventDefault();
  }

  function changeInput(e, type) {
    setInput({
      ...input,
      [type]: e.target.value
    });
  }

  async function signUpUser() {
    const userData = {
      name: "Tom",
      email: "demo03@gmail.com",
      password: "123456789",
      age: 24
    };
    const userSignUp = await user.signUp(userData);
    if (userSignUp) {
      console.log(userSignUp);
    }
  }

  return (
    <FormWrapperFixedCenter>
      <FormWrapper>
        <FormTab />
      </FormWrapper>
    </FormWrapperFixedCenter>
  );
}

export default FormLoginAndSignUp;
