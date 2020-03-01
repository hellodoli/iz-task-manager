import React from "react";

import Container from '@material-ui/core/Container';
// components
import FormSome from "./components/FormLoginAndSignUp";

function App() {
  return (
    <div className="App">
      <Container maxWidth="lg">
        <FormSome />
      </Container>
    </div>
  );
}

export default App;
