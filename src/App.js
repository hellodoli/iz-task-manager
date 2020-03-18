import React from 'react';

import { ThemeProvider } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
// Components
import FormLoginAndSignUp from './components/FormLoginAndSignUp';

function App() {
  return (
    <div className="App">
      <Container maxWidth="lg">
        <FormLoginAndSignUp />
      </Container>
    </div>
  );
}

export default App;
