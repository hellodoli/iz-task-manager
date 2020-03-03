import React, { useState } from "react";
import User from "../../apis/user";

import { Paper } from "@material-ui/core";
import {
  FormWrapperFixedCenter,
  FormWrapper,
  FormWrapperHeader,
  muiUseStyles
} from "./styled";

// Components
import Tab from "./Tab";
import TabPanel from "./TabPanel";
import FormSignIn from "./FormSignIn";

// unique key
const usernameInput = "username";
const passwordInput = "password";

function FormLoginAndSignUp() {
  const [user] = useState(new User());
  const [input, setInput] = useState({
    [usernameInput]: "",
    [passwordInput]: ""
  });
  const [value, setValue] = useState(0);

  // handle value Tab, TabPanel
  const handleChangeTabValue = (event, value) => setValue(value);

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
        <Paper square>
          {/* Form tab */}
          <FormWrapperHeader>
            <Tab value={value} handleChange={handleChangeTabValue} />
          </FormWrapperHeader>
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
      </FormWrapper>
    </FormWrapperFixedCenter>
  );
}

export default FormLoginAndSignUp;
