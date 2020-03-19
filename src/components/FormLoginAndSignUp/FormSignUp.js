import React, { useState } from 'react';
import validator from 'validator';
import User from '../../apis/user';
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
  IconButton,
  Button
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

function FormSignUp() {
  const [user] = useState(new User());
  const [values, setValues] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    isShowPassword: false
  });

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // handle change name, email, username, password
  const handleChange = prop => event => {
    setValues({
      ...values,
      [prop]: event.target.value
    });
  };

  // handle click show Password
  const handleClickShowpassword = () => {
    setValues({
      ...values,
      isShowPassword: !values.isShowPassword
    });
  };

  async function handleCheckValidInput() {
    let isValidName = null;
    let isValidEmail = null;
    let isValidPassword = null;

    const name = values.name.trim();
    const email = values.email.trim();
    const password = values.password;

    if (email === '' || !validator.isEmail(email)) {
      isValidEmail = false;
      setEmailError("Email isn't valid");
    } else {
      isValidEmail = true;
      setEmailError('');
    }

    if (name === '') {
      isValidName = false;
      setNameError("Full name can't be empty");
    } else {
      isValidName = true;
      setNameError('');
    }

    if (password === '') {
      isValidPassword = false;
      setPasswordError("Password can't be empty");
    } else if (password.length < 7) {
      isValidPassword = false;
      setPasswordError('Password must be at least 7 characters long');
    } else if (password.toLowerCase().includes('password')) {
      isValidPassword = false;
      setPasswordError("Password can't contain 'password'");
    } else {
      isValidPassword = true;
      setPasswordError('');
    }

    // call API when valid
    if (isValidPassword && isValidEmail && isValidName) {
      console.log('valid sign up');
      const newUser = {
        name,
        email,
        password
      };
      await user.signUp(newUser);
      if (user.newUserInfo.email) {
        // save cookies
        console.log('signup success');
      } else {
        console.log('signup fail');
      }
    }
  }

  function submitSignUp(event) {
    event.preventDefault();
    handleCheckValidInput();
  }

  return (
    <div>
      <form autoComplete="off" onSubmit={submitSignUp}>
        {/* Name */}
        <FormControl
          fullWidth
          variant="outlined"
          margin="normal"
          error={nameError === '' ? false : true}
        >
          <InputLabel htmlFor="outlined-adornment-name-signup">
            Your name
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-name-signup"
            value={values.name}
            onChange={handleChange('name')}
            labelWidth={70}
          ></OutlinedInput>
          {nameError !== '' && <FormHelperText>{nameError}</FormHelperText>}
        </FormControl>
        {/* Email */}
        <FormControl
          fullWidth
          variant="outlined"
          margin="normal"
          error={emailError === '' ? false : true}
        >
          <InputLabel htmlFor="outlined-adornment-email-signup">
            Email
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-email-signup"
            type="email"
            value={values.email}
            onChange={handleChange('email')}
            labelWidth={70}
          ></OutlinedInput>
          {emailError !== '' && <FormHelperText>{emailError}</FormHelperText>}
        </FormControl>
        {/* Password */}
        <FormControl
          fullWidth
          variant="outlined"
          margin="normal"
          error={passwordError === '' ? false : true}
        >
          <InputLabel htmlFor="outlined-adornment-password-signup">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password-signup"
            required={true}
            type={values.isShowPassword ? 'text' : 'password'}
            value={values.password}
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
          {passwordError !== '' && (
            <FormHelperText>{passwordError}</FormHelperText>
          )}
        </FormControl>
        {/* Buttons Group */}
        <FormControl fullWidth margin="normal">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            onClick={submitSignUp}
          >
            Sign Up
          </Button>
        </FormControl>
      </form>
    </div>
  );
}

export default FormSignUp;
