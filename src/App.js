import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuth } from './actions/oauth';

import './theme/reboot.css';
import { ThemeProvider, CssBaseline } from '@material-ui/core';
import GlobalCSS from './theme/GlobalCSS';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
// Containers
import WrappRouter from './containers/WrappRouter';
// Components
import Loading from './components/Loading';

function LoadingRoot() {
  const isLoading = useSelector((state) => state.isLoading);
  if (!isLoading) return null;
  return <Loading fullScreen={true} />;
}

function App() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.dlTheme);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div className="App">
          {/* CSS Global */}
          <CssBaseline />
          <GlobalCSS />
          {/* Loading Root */}
          <LoadingRoot />
          {/* Main Route */}
          <WrappRouter />
        </div>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}

export default App;
