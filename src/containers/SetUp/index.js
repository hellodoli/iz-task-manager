import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { checkAuth } from '../../actions/oauth';

// Components
//import SetUp from './components/SetUp';
import FormLoginAndSignUp from '../../components/FormLoginAndSignUp';

function SetUp(props) {
  useEffect(() => {
    props.checkAuth();
  }, []);
  return (
    <div>
      { console.log(props.demo) }
    </div>
  );
}

const mmmm = state => ({
  demo: state.oauthReducer
});

export default connect(mmmm, { checkAuth })(SetUp);
