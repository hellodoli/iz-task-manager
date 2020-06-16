import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, useLocation } from 'react-router-dom';
import { checkAuth } from './actions/oauth';

import './theme/reboot.css';
import { ThemeProvider, CssBaseline } from '@material-ui/core';
import GlobalCSS from './theme/GlobalCSS';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

// Containers
import SetUp from './containers/SetUp';
import Main from './containers/Main';

// Components
import Loading from './components/Loading';
import FormLoginAndSignUp from './components/FormLoginAndSignUp';

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const selector = useSelector((state) => ({
    auth: state.oauthReducer,
    theme: state.dlTheme,
  }));
  const { auth, theme } = selector;

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (location.pathname === '/') {
    if (auth.isSignedIn === null) return <Loading fullScreen={true} />;
    return <SetUp isSignedIn={auth.isSignedIn} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div className="App">
          <Loading fullScreen={true} />
          {/* CSS Global */}
          <CssBaseline />
          <GlobalCSS />
          {/* Main Route */}
          <Switch>
            <Route path="/show" component={FormLoginAndSignUp} />
            <Route path="/app" component={Main} />
          </Switch>
        </div>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}

export default App;
