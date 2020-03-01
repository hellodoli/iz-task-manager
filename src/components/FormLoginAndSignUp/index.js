import React, { useState } from "react";

import User from "../../apis/user";

import { 
  makeStyles,
  Tabs,
  Tab,
  TextField,
  Paper
} from "@material-ui/core";
import {
  FormWrapperFixedCenter,
  FormWrapper,
  FormWrapperHeader,
  // MaterialUI makeStyles
  formTabHeader
} from './styled';

// unique key
const usernameInput = "username";
const passwordInput = "password";

function FormTab() {
  const [value, setValue] = useState(0);

  const handleChange = (event, value) => {
    setValue(value);
  }

  const classes = formTabHeader();
  
  return (
    <Paper square>
      <FormWrapperHeader>
        <Tabs
          value={value}
          onChange={handleChange}
          centered={true}
          aria-label="form-tabs-header"
          classes={{ 
            root: classes.root,
            indicator: classes.indicator
          }}
        >
          <Tab label="ALREADY MEMBER ?" />
          <Tab label="NEW MEMBER ?" />
        </Tabs>
      </FormWrapperHeader>
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
