import React, { useState, useEffect } from 'react';

import { useTheme } from '@material-ui/core/styles';

import { connect } from 'react-redux';

import { Switch, Route, useLocation } from 'react-router-dom';

import { checkAuth } from './actions/oauth';

// Components
import Loading from './components/Loading';
import FormLoginAndSignUp from './components/FormLoginAndSignUp';

// Containers
import GlobalCSS from './containers/GlobalCSS';
import SetUp from './containers/SetUp';
import Main from './containers/Main';

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

function App(props) {
  const { auth, checkAuth } = props;
  const location = useLocation();
  console.log(useDarkTheme());

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const renderFirstBootstrap = () => {
    if (location.pathname === '/') {
      if (auth.isSignedIn === null) return <Loading fullScreen={true} />;
      return <SetUp isSignedIn={auth.isSignedIn} />;
    }
    return null;
  };

  return (
    <div className="App">
      {/* Global CSS */}
      <GlobalCSS />
      {/* Set Up */}
      {renderFirstBootstrap()}
      {/* Main Route */}
      <Switch>
        <Route path="/show" component={FormLoginAndSignUp} />
        <Route path="/app" component={Main} />
      </Switch>
    </div>
  );
}

const mapStateToProps = state => ({
  auth: state.oauthReducer
});

export default connect(mapStateToProps, { checkAuth })(App);
