import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, withRouter } from 'react-router-dom';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import './index.css';
import logo from '../../assets/img/logo.png';
import { forgotPassword } from "../../store/actions/Auth";

const ForgotPassword = ({ history }) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    setLoading(true)
    dispatch(forgotPassword({
      formData: { email },
      successCallback: () => {
        setLoading(false)
        history.push('/reset-password')
      },
      failCallback: () => {
        setLoading(false)
      }
    }));
  };


  return (
    <div className="login-page">
      <div className="logo-area">
        <img className="login-page-logo" src={logo} alt='logo' />
      </div>
      <div className='auto-container'>
        <div className="row">
          <div className="col-lg-6 col-md-12 col-sm-12 login-area">
            <div className="left-img-area">
              <img src={require('../../assets/img/login-left-img.png')} alt='' />
              <h2>Portal</h2>
              <p>Welcome to Weam Elnaggar Real Estate Portal where innovation knows no boundaries.</p>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12 login-area">
            <div className="login-form">
              <ValidatorForm className="validator-form mt-4" onSubmit={handleLogin}>
                <div className="group-form">
                  <label>Email</label>
                  <TextValidator
                    className="login-input-fields"
                    type="text"
                    name="email"
                    margin="dense"
                    variant="outlined"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    validators={['required', 'isEmail']}
                    errorMessages={['Email can not be empty', 'Email is not valid']}
                  />
                </div>
                <div className="group-form checkbox-group">
                  <Link className="forget-pass" to="/login">Login ?</Link>
                </div>
                <div className="group-form text-center">
                  <button type='submit' className="btn-style-one" disabled={loading}>
                    {!loading
                      ? "Send Reset Code"
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


export default (withRouter(ForgotPassword));