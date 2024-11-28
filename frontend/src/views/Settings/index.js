import { toast } from 'react-toastify';
import Switch from '@material-ui/core/Switch';
import React, { useEffect, useState, useRef } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { Modal, CardBody, Card, CardHeader, CardTitle, ModalBody, ModalHeader, TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";

import classnames from 'classnames';


import Loader from '../../components/Loader';

import { enableEmail, enableSms, sendEmail, sendSms, updateProfile } from '../../store/actions/User.js';
import './index.css';
// import { changePassword } from '../../store/actions/Auth';
import UserModal from './emailModal';
import PhoneModal from './phoneModal';


const initialFormState = {
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: ''
}

const initialShowState = {
  oldPassword: false,
  newPassword: false,
  confirmNewPassword: false
}

const Styles = {
  cancelButton: {
    '&.MuiButton-contained': {
      '&:hover': {
        boxShadow: 'initial',
        backgroundColor: 'unset !important',
      }
    },
    '&.MuiButton-root': {
      '&:hover': {
        textDecoration: 'initial',
        backgroundColor: 'initial',
      }
    }

  }
}

const Settings = ({ classes }) => {

  const { userDetails } = useSelector(st => st.User)

  const [state, setState] = useState({
    isSMSAuthenticationModal: false,
    isEmailAuthenticationModal: false,
    activeTab: "1",
    countryCode: 'us',
  })

  const [isFetching, setIsFetching] = useState(false)
  const dispatch = useDispatch()

  const [form, setForm] = useState(initialFormState)
  const [showState, setShowState] = useState(initialShowState);

  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [isEditEmailOpen, setIsEditEmailOpen] = useState(false);
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false)

  const [isEditPhoneOpen, setIsEditPhoneOpen] = useState(false)
  const [isPhoneSubmitting, setIsPhoneSubmitting] = useState(false)


  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')



  const [emailToggle, setEmailToggle] = useState(false);
  const [phoneToggle, setPhoneToggle] = useState(false);
  const [emailCode, setEmailCode] = useState(['', '', '', '', '', ''])
  const [phoneCode, setPhoneCode] = useState(['', '', '', '', '', ''])

  const handleEmailChange = e => {
    e.preventDefault();
    setIsEmailSubmitting(true);
    dispatch(updateProfile({
      formData: {
        email
      },
      successCallback: () => {
        setIsEditEmailOpen(false);
        setIsEmailSubmitting(false);
        setEmail('')
      },
      failCallback: () => {
        setIsEmailSubmitting(false);
      }
    }))
  }
  const handlePhoneChange = e => {
    e.preventDefault();
    setIsPhoneSubmitting(true);
    dispatch(updateProfile({
      formData: {
        phone
      },
      successCallback: () => {
        setIsEditPhoneOpen(false);
        setIsPhoneSubmitting(false);
        setPhone('')
      },
      failCallback: () => {
        setIsPhoneSubmitting(false);
      }
    }))
  }

  useEffect(() => {
    setEmailToggle(userDetails.emailEnabled);
    setPhoneToggle(userDetails.smsEnabled);
  }, [userDetails])

  const emailInputRefs = Array.from({ length: 6 }, () => useRef(null));
  const phoneInputRefs = Array.from({ length: 6 }, () => useRef(null));

  const handlePhoneInputChange = (index, value) => {
    if (value.length > 1) value = value.slice(value.length - 1)
    setPhoneCode(st => st.map((_, idx) => idx === index ? value : _))
    if (value.length === 1 && index < 5) {
      phoneInputRefs[index + 1].current.focus();
    }
    else if (index === 5) {
      handlePhoneSubmit(+`${phoneCode.join('')}${value}`);
    }
  };

  const handleEmailInputChange = (index, value) => {
    if (value.length > 1) value = value.slice(value.length - 1)
    setEmailCode(st => st.map((_, idx) => idx === index ? value : _))
    if (value.length === 1 && index < 5) {
      emailInputRefs[index + 1].current.focus();
    }
    else if (index === 5) {
      handleEmailSubmit(+`${emailCode.join('')}${value}`);
    }
  };


  const handleChange = e => {
    if (!e.target) return
    console.log("e", e)
    console.log("e.target", e.target)
    setForm(st => ({
      ...st,
      [e.target && e.target.name]: e.target && e.target.value
    }))
  }

  const toggle = (tab) => {
    if (state.activeTab !== tab) {
      setState(st => ({
        ...st,
        activeTab: tab
      }));
    }
  }

  const toggleSMSAuthenticationModal = () => setState(st => ({ ...st, isSMSAuthenticationModal: !state.isSMSAuthenticationModal }));
  const toggleEmailAuthenticationModal = () => setState(st => ({ ...st, isEmailAuthenticationModal: !state.isEmailAuthenticationModal }));


  const handleSubmit = e => {
    e.preventDefault()

    if (form.newPassword !== form.confirmNewPassword)
      return toast.error("New Password must match Confirm Password")
    setIsFetching(true);

    dispatch(changePassword({
      formData: {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword
      },
      successCallback: () => {
        setIsFetching(false)
        toast.success('Password updated.')
        setForm(initialFormState)
      },
      failCallback: () => {
        setIsFetching(false)
      }
    }))
  }

  const handleEmailToggle = e => {
    const value = e.target.checked;

    console.log("value", value);
    if (value) {
      dispatch(sendEmail({
        successCallback: () =>
          toggleEmailAuthenticationModal(),
        failCallback: () => { }

      }))
    }

    setEmailToggle(value)
  }


  const handlePhoneToggle = e => {
    const value = e.target.checked;

    console.log("value", value);
    if (value) {
      toggleSMSAuthenticationModal();
      dispatch(sendSms({
        successCallback: () =>
          toggleSMSAuthenticationModal(),
        failCallback: () => { }
      }))
    }

    setPhoneToggle(value)
  }

  const handleEmailSubmit = (code) => {

    setTimeout(() => {
      setIsAuthenticating(true)
      dispatch(enableEmail({
        formData: {
          authKey: code,
        },
        successCallback: () => {
          toast.success('Email enabled');
          setIsAuthenticating(false)
          toggleEmailAuthenticationModal()
        },
        failCallback: () => {
          setIsAuthenticating(false)
        },
      }))
    }, 1000);
  }

  const handlePhoneSubmit = (code) => {

    setTimeout(() => {
      setIsAuthenticating(true)
      dispatch(enableSms({
        formData: {
          authKey: code,
        },
        successCallback: () => {
          toast.success('SMS enabled');
          setIsAuthenticating(false)
          toggleSMSAuthenticationModal()
        },
        failCallback: () => {
          setIsAuthenticating(false)
        },
      }))
    }, 1000);
  }

  return (
    <div className='content'>
      <div className="main-container">
        <div className='row'>
          <div className='col-12'>
            <Card className="card-table">
              <CardHeader>
                <CardTitle tag="h3" style={{ marginBottom: 0 }}>
                  <div tag="h2">Settings</div>
                  <div className='tabs-area'>
                    <Nav tabs>
                      <NavItem>
                        <NavLink
                          className={classnames({ active: state.activeTab === '1' })}
                          onClick={() => { toggle('1'); }}
                        >
                          Change Password
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({ active: state.activeTab === '2' })}
                          onClick={() => { toggle('2'); }}
                        >
                          Account Details
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className='col-lg-12 col-md-12' >
                  <TabContent activeTab={state.activeTab}>
                    <TabPane tabId="1">
                      <Card className="card-tabs-form">
                        <CardBody>
                          <div className='box-settings'>
                            <div className='left-area'>
                              <h3>Change Password</h3>
                              <p>Make sure you remember the passwords to log in.</p>
                            </div>
                            <div className='right-area'>
                              <ValidatorForm className="validator-form mt-4" onSubmit={handleSubmit}>
                                <div className="group-form">
                                  <label>Old Password</label>
                                  <TextValidator
                                    className="login-input-fields"
                                    fullWidth
                                    margin="dense"
                                    type={showState.oldPassword ? 'text' : "password"}
                                    name="oldPassword"
                                    required
                                    placeholder="Enter your old password"
                                    variant="outlined"
                                    validators={['required']}
                                    onChange={handleChange}
                                    value={form.oldPassword}
                                    errorMessages={['Password can not be empty']}
                                  />
                                  <button className='icon-show' onClick={e => {
                                    e.preventDefault();
                                    setShowState(st => ({ ...st, oldPassword: !st.oldPassword }))
                                  }}>
                                    <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="VisibilityIcon"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg>
                                  </button>
                                  {/* <button className='icon-hide'>
                                          <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="VisibilityOffIcon"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"></path></svg>
                                        </button> */}
                                </div>
                                <div className="group-form">
                                  <label>New Password</label>
                                  <TextValidator
                                    className="login-input-fields"
                                    fullWidth
                                    margin="dense"
                                    type={showState.newPassword ? 'text' : "password"}
                                    name="newPassword"
                                    required
                                    placeholder="Enter new password"
                                    variant="outlined"
                                    validators={['required']}
                                    onChange={handleChange}
                                    value={form.newPassword}
                                    errorMessages={['Password can not be empty']}
                                  />
                                  <button className='icon-show' onClick={e => {
                                    e.preventDefault();
                                    setShowState(st => ({ ...st, newPassword: !st.newPassword }))
                                  }}>
                                    <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="VisibilityIcon"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg>
                                  </button>
                                  {/* <button className='icon-hide'>
                                          <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="VisibilityOffIcon"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"></path></svg>
                                        </button> */}
                                </div>
                                <div className="group-form">
                                  <label>Confrim Password</label>
                                  <TextValidator
                                    className="login-input-fields"
                                    fullWidth
                                    margin="dense"
                                    type={showState.confirmNewPassword ? 'text' : "password"}
                                    name="confirmNewPassword"
                                    placeholder="Enter confrim password"
                                    required
                                    variant="outlined"
                                    validators={['required']}
                                    onChange={handleChange}
                                    value={form.confirmNewPassword}
                                    errorMessages={['Password can not be empty']}
                                  />
                                  <button className='icon-show' onClick={e => {
                                    e.preventDefault();
                                    setShowState(st => ({ ...st, confirmNewPassword: !st.confirmNewPassword }))
                                  }}>
                                    <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="VisibilityIcon"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg>
                                  </button>

                                </div>
                                <div className="group-form text-center">
                                  {/* <button type='reset' variant='contained' className={`btn-style-two`}>
                                    Cancel
                                  </button> */}
                                  <button type='submit' className={`btn-style-one`} disabled={isFetching}>
                                    {!isFetching
                                      ? "Save"
                                      : <div><i className="fa fa-spinner fa-spin"></i></div>
                                    }
                                  </button>
                                </div>
                              </ValidatorForm>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </TabPane>
                    <TabPane tabId="2">
                      <Card className="card-tabs-form">
                        <CardBody>
                          <div className='box-settings'>
                            <div className='left-area'>
                              {/* <div className='user-group'>
                                <label>User ID</label>
                                <div className='user-data'>
                                  <h3><i className='icon'><img src={require('../../assets/img/user-1.png')} alt='' /></i> Micheal George</h3>
                                  <button className='btn-style-one'>Edit</button>
                                </div>
                              </div> */}
                              <div className='user-group'>
                                <div className='user-data'>
                                  <h3><i className='icon'><img src={require('../../assets/img/mail.png')} alt='' /></i> Email Authentication</h3>
                                  <Switch disabled={!userDetails.email} checked={emailToggle} onChange={handleEmailToggle} />
                                </div>
                                <div className='user-data'>
                                  <div className='input-group'>
                                    <label>Email :</label>
                                    <input type="email" name="email" value={userDetails.email} disabled />
                                  </div>
                                  <button className='btn-style-one' onClick={() => {
                                    setEmail(userDetails.email);
                                    setIsEditEmailOpen(true);
                                  }}>Edit</button>
                                </div>
                              </div>
                            </div>
                            <div className='right-area'>
                              <div className='user-group'>
                                <div className='user-data'>
                                  <h3><i className='icon'><img src={require('../../assets/img/mail.png')} alt='' /></i> Phone Authentication</h3>
                                  <Switch disabled={!userDetails.phone} checked={phoneToggle} onChange={handlePhoneToggle} />
                                </div>
                                <div className='user-data'>
                                  <div className='input-group'>
                                    <label>Phone :</label>
                                    <input type="phone" name="phone" value={userDetails.phone} disabled />
                                  </div>
                                  <button className='btn-style-one' onClick={() => {
                                    setPhone(userDetails.phone);
                                    setIsEditPhoneOpen(true)
                                  }}>Edit</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </TabPane>
                  </TabContent>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* --------------- SMS Authentication Moodal--------------- */}
      <Modal isOpen={state.isSMSAuthenticationModal} toggle={() => {
        setPhoneToggle(false)
        toggleSMSAuthenticationModal()
      }} className={`main-modal new-user-modal`}>
        <ModalHeader toggle={() => {
          setPhoneToggle(false)
          toggleSMSAuthenticationModal()
        }}></ModalHeader>
        <ModalBody>
          <div className='content-area'>
            <h2>SMS Authentication</h2>
            <ValidatorForm className="validator-form mt-4">
              <div className="group-form">
                <label className='text-center'>Enter SMS code here</label>
                <div className='authentication-group'>
                  {phoneInputRefs.map((ref, index) => (
                    <TextValidator
                      key={index}
                      fullWidth
                      className="login-input-fields"
                      type="number"
                      min={0}
                      required
                      name={`EmailCodeEnter${index}`}
                      value={phoneCode[index]}
                      margin="dense"
                      variant="outlined"
                      placeholder=""
                      inputRef={ref}
                      onChange={(e) => handlePhoneInputChange(index, e.target.value)}
                    />
                  ))}
                </div>

              </div>
              <div className="group-form text-center">
                <button className="btn-style-one" >
                  {!isAuthenticating
                    ? "Submit"
                    : <div><i className="fa fa-spinner fa-spin"></i></div>
                  }
                </button>
              </div>
            </ValidatorForm>
          </div>
        </ModalBody>
      </Modal>

      {/* --------------- Email Authentication Moodal--------------- */}
      <Modal isOpen={state.isEmailAuthenticationModal} toggle={() => {
        setEmailToggle(false);
        toggleEmailAuthenticationModal()
      }} className={`main-modal new-user-modal`}>
        <ModalHeader toggle={() => {
          setEmailToggle(false);
          toggleEmailAuthenticationModal()
        }}></ModalHeader>
        <ModalBody>
          <div className='content-area'>
            <h2>Email Authentication</h2>
            <ValidatorForm className="validator-form mt-4" onSubmit={e => {
              e.preventDefault()
              handleEmailSubmit(+emailCode.join(''))
            }}>
              <div className="group-form">
                <label className='text-center'>Enter email code here</label>
                {/* <div className='authentication-group'>
                  <TextValidator
                    fullWidth
                    className="login-input-fields"
                    type="number"
                    min={0}
                    required
                    name="EmailCodeEnter"
                    margin="dense"
                    variant="outlined"
                    placeholder=""
                  // onChange={(e) => setName(e.target.value)}
                  // value={EmailCodeEnter}
                  />
                  <TextValidator
                    fullWidth
                    className="login-input-fields"
                    type="number"
                    min={0}
                    required
                    name="EmailCodeEnter"
                    margin="dense"
                    variant="outlined"
                    placeholder=""
                  // onChange={(e) => setName(e.target.value)}
                  // value={EmailCodeEnter}
                  />
                  <TextValidator
                    fullWidth
                    className="login-input-fields"
                    type="number"
                    min={0}
                    required
                    name="EmailCodeEnter"
                    margin="dense"
                    variant="outlined"
                    placeholder=""
                  // onChange={(e) => setName(e.target.value)}
                  // value={EmailCodeEnter}
                  />
                  <TextValidator
                    fullWidth
                    className="login-input-fields"
                    type="number"
                    min={0}
                    required
                    name="EmailCodeEnter"
                    margin="dense"
                    variant="outlined"
                    placeholder=""
                  // onChange={(e) => setName(e.target.value)}
                  // value={EmailCodeEnter}
                  />
                  <TextValidator
                    fullWidth
                    className="login-input-fields"
                    type="number"
                    min={0}
                    required
                    name="EmailCodeEnter"
                    margin="dense"
                    variant="outlined"
                    placeholder=""
                  // onChange={(e) => setName(e.target.value)}
                  // value={EmailCodeEnter}
                  />
                  <TextValidator
                    fullWidth
                    className="login-input-fields"
                    type="number"
                    min={0}
                    required
                    name="EmailCodeEnter"
                    margin="dense"
                    variant="outlined"
                    placeholder=""
                  // onChange={(e) => setName(e.target.value)}
                  // value={EmailCodeEnter}
                  />
                </div> */}

                <div className='authentication-group'>
                  {emailInputRefs.map((ref, index) => (
                    <TextValidator
                      key={index}
                      fullWidth
                      className="login-input-fields"
                      type="number"
                      min={0}
                      required
                      name={`EmailCodeEnter${index}`}
                      value={emailCode[index]}
                      margin="dense"
                      variant="outlined"
                      placeholder=""
                      inputRef={ref}
                      onChange={(e) => handleEmailInputChange(index, e.target.value)}
                    />
                  ))}
                </div>
              </div>
              <div className="group-form text-center">
                <button className="btn-style-one" type='submit' disabled={isAuthenticating}>
                  {!isAuthenticating
                    ? "Submit"
                    : <div><i className="fa fa-spinner fa-spin"></i></div>
                  }
                </button>
              </div>
            </ValidatorForm>
          </div>
        </ModalBody>
      </Modal>

      <UserModal isOpen={isEditEmailOpen}
        setOpen={setIsEditEmailOpen} title={'Change Email'}
        isSubmitting={isEmailSubmitting} state={email}
        handleChange={e => setEmail(e.target.value)}
        handleSubmit={handleEmailChange}
      />

      <PhoneModal isOpen={isEditPhoneOpen}
        setOpen={setIsEditPhoneOpen} title={'Change Phone'}
        isSubmitting={isPhoneSubmitting} state={phone}
        handleChange={e => setPhone(e.target.value)}
        handleSubmit={handlePhoneChange}
      />

    </div>

  );
}

export default Settings;