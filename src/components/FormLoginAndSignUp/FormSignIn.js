import React, { useState } from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { setCookie } from '../../utils/cookies';
import User from '../../apis/user';
import { signIn } from '../../actions/oauth';

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

function FormSignIn(props) {
  const history = useHistory();
  const [userAPI] = useState(new User());
  const [values, setValues] = useState({
    email: '',
    password: '',
    isShowPassword: false,
    checked: false
  });

  const [eMailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  function clearErrorText(prop) {
    if (prop === 'email') {
      if (eMailError !== '') {
        setEmailError('');
      }
    }

    if (prop === 'password') {
      if (passwordError !== '') {
        setPasswordError('');
      }
    }
  }

  // handle change username, password
  const handleChange = prop => event => {
    setValues({
      ...values,
      [prop]: event.target.value
    });

    // clear error text when user type input
    clearErrorText(prop);
  };

  // handle click check 'keep login'
  const handleCheck = props => event => {
    setValues({
      ...values,
      [props]: event.target.checked
    });
  };

  // handle click show Password
  const handleClickShowpassword = () => {
    setValues({
      ...values,
      isShowPassword: !values.isShowPassword
    });
  };

  // call API SignIn
  async function callAPISignIn(userInfo) {
    console.log('>>> START SIGN IN <<<');
    await userAPI.signIn(userInfo);
    const data = userAPI.dataLogin;
    if (data.isError) {
      // set Error Text
      const { error, errorCode } = data;
      if (errorCode === 1) {
        setEmailError(error);
      } else if (errorCode === 2) {
        setPasswordError(error);
      }
    } else {
      if (data.user && data.token) {
        // clear Error Text
        setEmailError('');
        setPasswordError('');
        // set cookies
        const extimes = values.checked ? 30 : 'auto';
        setCookie('emailToken', data.token, extimes);
        // set login user info
        props.signIn();
        // logged
        history.push('/app');
      }
    }
  }

  function handleCheckValidInput() {
    let isValidEmail = null;
    let isValidPassword = null;

    const email = values.email.trim();
    const password = values.password;

    if (email === '' || !validator.isEmail(email)) {
      isValidEmail = false;
      setEmailError("Email isn't valid");
    } else {
      isValidEmail = true;
      setEmailError('');
    }

    if (password === '') {
      isValidPassword = false;
      setPasswordError("Password isn't valid");
    } else {
      isValidPassword = true;
      setPasswordError('');
    }

    if (isValidPassword && isValidEmail) {
      callAPISignIn({ email, password });
    }
  }

  function submitSignIn(event) {
    event.preventDefault();
    handleCheckValidInput();
  }

  return (
    <div>
      <form autoComplete="off" onSubmit={submitSignIn}>
        {/* Username */}
        <FormControl
          fullWidth
          variant="outlined"
          margin="normal"
          error={eMailError === '' ? false : true}
        >
          <InputLabel htmlFor="outlined-adornment-email-signin">
            Email
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-email-signin"
            value={values.email}
            onChange={handleChange('email')}
            labelWidth={40}
          ></OutlinedInput>
          {eMailError !== '' && <FormHelperText>{eMailError}</FormHelperText>}
        </FormControl>
        {/* Password */}
        <FormControl
          fullWidth
          variant="outlined"
          margin="normal"
          error={passwordError === '' ? false : true}
        >
          <InputLabel htmlFor="outlined-adornment-password-signin">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password-signin"
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
          {passwordError !== '' && (
            <FormHelperText>{passwordError}</FormHelperText>
          )}
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
            label="Remember me for 30 days"
          />
        </FormControl>
        {/* Buttons Group */}
        <FormControl fullWidth margin="normal">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Login
          </Button>
        </FormControl>
      </form>
    </div>
  );
}

FormSignIn.propTypes = {
  signIn: PropTypes.func.isRequired
};

export default connect(null, { signIn })(FormSignIn);
