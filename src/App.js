import React, { useState } from 'react';

import { useTheme } from '@material-ui/core/styles';

// Containers
import GlobalCSS from './containers/GlobalCSS';
import SetUp from './containers/SetUp';

function useDarkTheme() {
  const [theme, setTheme] = useState(useTheme());
  const {
    palette: { type }
  } = theme;

  const toggleDarkTheme = () => {
    const updateTheme = {
      ...theme,
      palette: {
        ...theme.palette,
        type: type === 'light' ? 'dark' : 'light'
      }
    };
    setTheme(updateTheme);
  };
  return [theme, toggleDarkTheme];
}

function App() {
  return (
    <div className="App">
      {/* Global CSS */}
      <GlobalCSS />
      {/* SetUp */}
      <SetUp />
    </div>
  );
}

export default App;
