import EventBus from 'eventing-bus';
import React, { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { createBrowserHistory } from "history";
import { ToastContainer, toast } from 'react-toastify';
import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import Admin from "./layouts/Admin.jsx";
import Login from "./views/Login/index.js";
import Signup from "./views/Signup/index.js";

import { logout } from './store/actions/Auth';
import { getMe } from './store/actions/User.js';
import PrivateRoute from './store/PrivateRoute';

import './App.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const hist = createBrowserHistory();

export const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getMe());
    EventBus.on('error', (e) => toast.error(e, {position: toast['POSITION']['BOTTOM_CENTER']}));
    EventBus.on('success', (e) => toast.success(e, {position: toast['POSITION']['BOTTOM_CENTER']}));
    EventBus.on("tokenExpired", () => dispatch(logout()));
  }, [])

  return (
    <div>
      <ToastContainer />
      <Router history={hist}>
        <Switch>
          <Route exact path="/login" render={props => <Login history {...props} />} />
          <Route exact path="/signup" render={props => <Signup history {...props} />} />
          <PrivateRoute path="/home" component={props => <Admin {...props} />} />
          <Redirect from="*" to="/login" />
        </Switch>
      </Router>
    </div>
  )
}

export default App;