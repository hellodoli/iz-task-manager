import React, { useState } from 'react';

import User from '../../apis/user';
import { setCookies } from '../../utils/cookies';

import { Visibility, VisibilityOff } from '@material-ui/icons';
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
  FormControlLabel,
  FormHelperText,
  Checkbox
} from '@material-ui/core';

function FormSignIn() {
  const [user] = useState(new User());
  const [values, setValues] = useState({
    checked: false,
    username: '',
    password: '',
    isShowPassword: false
  });

  const handleChange = prop => event => {
    setValues({
      ...values,
      [prop]: event.target.value
    });
  };

  const handleCheck = props => event => {
    setValues({
      ...values,
      [props]: event.target.checked
    });
  };

  const handleClickShowpassword = () => {
    setValues({
      ...values,
      isShowPassword: !values.isShowPassword
    });
  };

  async function clickSignIn(event) {
    event.preventDefault();
    const userData = {
      name: 'Tom',
      email: 'demo03@gmail.com',
      password: '123456789',
      age: 24
    };
    const userSignUp = await user.signUp(userData);
    if (userSignUp) {
      console.log(userSignUp);
    }
  }

  return (
    <div>
      <form autoComplete="off" onSubmit={clickSignIn}>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel htmlFor="outlined-adornment-username-signin">
            Username
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-username-signin"
            required={true}
            value={values.username}
            onChange={handleChange('username')}
            labelWidth={70}
          ></OutlinedInput>
        </FormControl>
        <FormControl fullWidth variant="outlined" margin="normal" error>
          <InputLabel htmlFor="outlined-adornment-password-signin">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password-signin"
            required={true}
            value={values.password}
            type={values.isShowPassword ? 'text' : 'password'}
            onChange={handleChange('password')}
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

          {/*<FormHelperText id="component-error-text">Error</FormHelperText>*/}
        </FormControl>
        {/* Remember Login */}
        <FormControl fullWidth margin="dense">
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={values.checked}
                value="checked"
                onChange={handleCheck('checked')}
              />
            }
            label="Sample text"
          />
        </FormControl>
        {/* Buttons Group */}
        <FormControl fullWidth margin="normal">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            onClick={clickSignIn}
          >
            Login
          </Button>
        </FormControl>
      </form>
    </div>
  );
}

export default FormSignIn;
