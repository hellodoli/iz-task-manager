import React, { useState } from "react";

import Users from "../apis/users";

import TextField from "@material-ui/core/TextField";

const usernameInput = "username";
const passwordInput = "password";

function Form() {
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
    await user.signUp({
      name: "Tommy",
      email: "demo@gmail.com",
      password: "123456789",
      age: 24
    });
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <TextField label="Username" variant="outlined" />
        <TextField variant="outlined" />

        <button type="submit" onClick={signUpUser}>
          Signin
        </button>
      </form>
    </div>
  );
}

export default Form;
