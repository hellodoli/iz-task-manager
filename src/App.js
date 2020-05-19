import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, useLocation } from 'react-router-dom';
// import { useTheme } from '@material-ui/core/styles';
import { checkAuth } from './actions/oauth';

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

// CSS
import './reboot.css';
import GlobalCSS from './containers/GlobalCSS';

// Components
import Loading from './components/Loading';
import FormLoginAndSignUp from './components/FormLoginAndSignUp';

// Containers
import SetUp from './containers/SetUp';
import Main from './containers/Main';

/*function useDarkTheme() {
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
}*/

function App(props) {
  const { auth, checkAuth } = props;
  const location = useLocation();
  //console.log(useDarkTheme());

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
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
    </MuiPickersUtilsProvider>
  );
}

App.propTypes = {
  auth: PropTypes.object.isRequired,
  checkAuth: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.oauthReducer
});

export default connect(mapStateToProps, { checkAuth })(App);
