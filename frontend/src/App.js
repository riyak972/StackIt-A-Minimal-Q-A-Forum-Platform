import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import PrivateRoute from './components/routing/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Alert from './components/layout/Alert';
import Home from './components/pages/Home';
import Question from './components/pages/Question';
import AskQuestion from './components/pages/AskQuestion';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Notifications from './components/pages/Notifications';

import './App.css';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

class App extends React.Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Alert />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <PrivateRoute exact path="/ask" component={AskQuestion} />
              <PrivateRoute exact path="/notifications" component={Notifications} />
              <Route exact path="/questions/:id" component={Question} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;