import React, { useState } from "react";
import clsx from "clsx";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton
} from "@material-ui/core";
import { muiUseStyles } from "./styled";

function FormSignIn() {
  const classes = muiUseStyles();
  const [values, setValues] = useState({
    username: "",
    password: "",
    isShowPassword: false
  });

  const handleChange = prop => event => {
    setValues({
      ...values,
      [prop]: event.target.value
    });
  };

  const handleClickShowpassword = () => {
    setValues({
      ...values,
      isShowPassword: !values.isShowPassword
    });
  };

  return (
    <div>
      <form noValidate autoComplete="off">
        <FormControl
          fullWidth
          variant="outlined"
          className={clsx(classes.margin)}
        >
          <InputLabel htmlFor="outlined-adornment-username-signin">
            Username
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-username-signin"
            value={values.username}
            onChange={handleChange("username")}
            labelWidth={70}
          ></OutlinedInput>
        </FormControl>
        <FormControl
          fullWidth
          variant="outlined"
          className={clsx(classes.margin)}
        >
          <InputLabel htmlFor="outlined-adornment-password-signin">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password-signin"
            value={values.password}
            type={values.isShowPassword ? "text" : "password"}
            onChange={handleChange("password")}
            labelWidth={70}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowpassword}
                  edge="end"
                >
                  {values.isShowPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          ></OutlinedInput>
          <div>{values.password}</div>
        </FormControl>
      </form>
    </div>
  );
}

export default FormSignIn;
