import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import './index.css';
// import logo from '../../assets/img/logo.png';
import { login, toggleLogin } from "../../store/actions/Auth";


function Login({ history, login, toggleLogin, isLogin, auth }) {
  const [email, setEmail] = useState('');
  const [password, setPassowrd] = useState('');
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (auth) history.push('/home')
  }, [auth]);

  const handleLogin = () => {
    toggleLogin();
    login({ data: { email, password }, history });
  };


  return (
    <div className="login-page">
      <div className="logo-area">
        {/* <img className="login-page-logo" src={logo} alt='logo' /> */}
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
              <h2 className="text-center">Login</h2>
              <ValidatorForm className="validator-form mt-4" onSubmit={handleLogin}>
                <div className="group-form">
                  <label>Email</label>
                  <TextValidator
                    className="login-input-fields"
                    type="text"
                    name="email"
                    margin="dense"
                    variant="outlined"
                    placeholder="Email here"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    validators={['required', 'isEmail']}
                    errorMessages={['Email can not be empty', 'Email is not valid']}
                  />
                </div>
                <div className="group-form">
                  <label>Password</label>
                  <TextValidator
                    className="login-input-fields"
                    margin="dense"
                    type={showPassword ? 'text' : "password"}
                    name="password"
                    placeholder="Password here"
                    variant="outlined"
                    validators={['required']}
                    onChange={(e) => setPassowrd(e.target.value)}
                    value={password}
                    errorMessages={['Password can not be empty']}
                  />
                  {/* {
                    showPassword ?
                      <button className='icon-show'
                        onClick={e => {
                          console.log("damn")
                          setShowPassword(true);
                          e.preventDefault();
                        }}>
                        <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="VisibilityIcon"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg>
                      </button>
                      :
                      <button className='icon-hide' onClick={e => {
                        console.log("damn")
                        setShowPassword(false);
                        e.preventDefault();
                      }}>
                        <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="VisibilityOffIcon"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"></path></svg>
                      </button>

                  } */}
                </div>
                <div className="group-form checkbox-group">
                  Dont have an account?
                  <Link className="forget-pass" to="/signup">Signup</Link>
                </div>
                <div className="group-form text-center">
                  <button type='submit' className="btn-style-one" disabled={isLogin}>
                    {!isLogin
                      ? "LOGIN"
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

const mapDispatchToProps = { login, toggleLogin };

const mapStateToProps = ({ Auth }) => {
  let { isLogin, auth } = Auth;
  return { isLogin, auth }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);