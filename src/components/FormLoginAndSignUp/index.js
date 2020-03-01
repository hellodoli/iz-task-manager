import React, { useState } from "react";

import Users from "../apis/users";

import TextField from "@material-ui/core/TextField";
//import Appbar from "@material-ui/core/AppBar";

const usernameInput = "username";
const passwordInput = "password";

function FormLoginAndSignUp() {
  const [input, setInput] = useState({
    [usernameInput]: "",
    [passwordInput]: ""
  });

  const [user] = useState(new Users());

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
    <div>Hello</div>
  );
}

export default FormLoginAndSignUp;
