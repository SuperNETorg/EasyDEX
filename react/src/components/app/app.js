import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../../actions/actionCreators';
import Main from '../main/main';

function mapStateToProps(state) {
  return {
    login: state.login,
    toaster: state.toaster,
    AddCoin: state.AddCoin,
    Main: state.Main,
    Dashboard: state.Dashboard,
    ActiveCoin: state.ActiveCoin,
    Settings: state.Settings,
    Interval: state.Interval,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

const App = connect(mapStateToProps, mapDispatchToProps)(Main);

export default App;
