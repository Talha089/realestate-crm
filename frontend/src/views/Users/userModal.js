import React from 'react'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

const UserModal = ({ isOpen, setOpen, handleChange, state, title, handleSubmit, isSubmitting }) => {
  return (
    <Modal isOpen={isOpen} className={`main-modal new-user-modal`}>
      <ModalHeader toggle={() => setOpen(st => !st)}></ModalHeader>
      <ModalBody>
        <div className='content-area'>
          <h2>{title}</h2>
          <ValidatorForm className="validator-form mt-4" onSubmit={handleSubmit}>
            <div className='row'>
              <div className='col-lg-6 col-md-12'>
                <div className="group-form">
                  <label>Name</label>
                  <TextValidator
                    fullWidth
                    required
                    name="name"
                    type="text"
                    margin="dense"
                    variant="outlined"
                    value={state.name}
                    onChange={handleChange}
                    validators={['required']}
                    placeholder="Enter your name"
                    className="login-input-fields"
                    errorMessages={['Name can not be empty', 'Name is not valid']}
                  />
                </div>
              </div>
              <div className='col-lg-6 col-md-12'>
                <div className="group-form">
                  <label>Email</label>
                  <TextValidator
                    fullWidth
                    type="text"
                    required
                    name="email"
                    margin="dense"
                    variant="outlined"
                    value={state.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="login-input-fields"
                    validators={['required', 'isEmail']}
                    errorMessages={['Email can not be empty', 'Email is not valid']}
                  />
                </div>
              </div>
              <div className={'col-lg-6 col-md-12'}>
                <div className="group-form">
                  <label>Is Active</label>
                  <FormControl fullWidth>
                    <Select
                      required
                      labelId="demo-role-select-label"
                      id="demo-role-select"
                      value={state.isActive}
                      label="Age"
                      placeholder='Disable a Agent'
                      onChange={handleChange}
                      name='isActive'
                    >
                      <MenuItem value={true}>Active</MenuItem>
                      <MenuItem value={false}>Deactivate</MenuItem>
                    </Select>
                  </FormControl>
                </div>

              </div>

              <div className={'col-lg-6 col-md-12'}>
                <div className="group-form">
                  <label>Role</label>
                  <FormControl fullWidth>
                    <Select
                      required
                      labelId="demo-role-select-label"
                      id="demo-role-select"
                      value={state.role}
                      label="Age"
                      placeholder='Disable a Agent'
                      onChange={handleChange}
                      name='role'
                    >
                      <MenuItem value={'admin'}>Admin</MenuItem>
                      <MenuItem value={'manager'}>Manager</MenuItem>
                      <MenuItem value={'agent'}>Agent</MenuItem>
                    </Select>
                  </FormControl>
                </div>

              </div>
              {title === 'Create User' && <div className='col-lg-12 col-md-12'>
                <div className="group-form">
                  <label>Password</label>
                  <TextValidator
                    fullWidth
                    className="login-input-fields"
                    type="password"
                    required
                    name="password"
                    margin="dense"
                    variant="outlined"
                    placeholder="Enter your password"
                    onChange={handleChange}
                    value={state.password}
                    validators={['required']}
                    errorMessages={['Password can not be empty']}
                  />
                </div>
              </div>}
              <div className='col-12'>
                <div className="group-form text-center">
                  <button type='submit' className="btn-style-one" disabled={isSubmitting}>
                    {!isSubmitting
                      ? "Submit"
                      : <div><i className="fa fa-spinner fa-spin"></i></div>
                    }
                  </button>
                </div>
              </div>
            </div>

          </ValidatorForm>
        </div>
      </ModalBody>
    </Modal >
  )
}

export default UserModal;