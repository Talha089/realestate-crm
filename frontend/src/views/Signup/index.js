import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import { Link, withRouter } from 'react-router-dom';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import './index.css';
import logo from '../../assets/img/logo.png';
import { signup } from "../../store/actions/Auth";

const initialState = {
  name: '',
  email: '',
  password: '',
}

const Signup = ({ history, auth }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(initialState);


  useEffect(() => {

    if (auth) {
      console.log('*** useEFFECT')
      history.push('/home')
    }
  }, [auth]);


  const handleChange = (e) => {
    setState(st => ({
      ...st,
      [e.target.name]: e.target.value // Correctly updates the state
    }));
  };

  const handleLogin = () => {
    // Validate name field only if it's defined
    if (state.name && /[^a-zA-Z\s]/.test(state.name)) {
      return toast.error('Name should only contain alphabets and spaces');
    }

    setLoading(true);
    dispatch(signup({
      data: {
        name: state.name,
        email: state.email,
        password: state.password,
      },
      history
    }));
  };

  return (
    <div className="login-page">
      <div className="logo-area">
        <img className="login-page-logo" src={logo} alt="logo" />
      </div>
      <div className="auto-container">
        <div className="row">
          <div className="col-lg-6 col-md-12 col-sm-12 login-area">
            <div className="left-img-area">
              <img src={require('../../assets/img/login-left-img.png')} alt="" />
              <h2>Portal</h2>
              <p>Welcome to Weam Elnaggar Real Estate Portal where innovation knows no boundaries.</p>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12 login-area">
            <div className="login-form">
              <ValidatorForm className="validator-form mt-4" onSubmit={handleLogin}>
                <div className="group-form">
                  <label>Name</label>
                  <TextValidator
                    className="login-input-fields"
                    type="text"
                    name="name" // Fixed here
                    margin="dense"
                    variant="outlined"
                    onChange={handleChange}
                    value={state.name}
                    required
                  />
                </div>
                <div className="group-form">
                  <label>Email</label>
                  <TextValidator
                    className="login-input-fields"
                    type="email"
                    name="email"
                    margin="dense"
                    validators={['required', 'isEmail']}
                    variant="outlined"
                    onChange={handleChange}
                    value={state.email}
                    required
                  />
                </div>
                <div className="group-form">
                  <label>Password</label>
                  <TextValidator
                    className="login-input-fields"
                    type="password"
                    name="password"
                    margin="dense"
                    variant="outlined"
                    onChange={handleChange}
                    value={state.password}
                    required
                  />
                </div>
                <div className="group-form checkbox-group">
                  <Link className="forget-pass" to="/login">Login?</Link>
                </div>
                <div className="group-form text-center">
                  <button type="submit" className="btn-style-one" disabled={loading}>
                    {!loading
                      ? "Signup"
                      : <div><i className="fa fa-spinner fa-spin"></i></div>
                    }
                  </button>
                </div>
              </ValidatorForm>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default (withRouter(Signup));
