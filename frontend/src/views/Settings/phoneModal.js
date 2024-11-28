import React from 'react'
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

const PhoneModal = ({ isOpen, setOpen, handleChange, state, title, handleSubmit, isSubmitting }) => {
  return (
    <Modal isOpen={isOpen} className={`main-modal new-user-modal email-modal`}>
      <ModalHeader toggle={() => setOpen(st => !st)}></ModalHeader>
      <ModalBody>
        <div className='content-area'>
          <h2>{title}</h2>
          <ValidatorForm className="validator-form mt-4" onSubmit={handleSubmit}>
            <div className='row'>
              <div className='col-md-12'>
                <div className="group-form">
                  <label>Phone</label>
                  <TextValidator
                    fullWidth
                    className="login-input-fields"
                    type="number"
                    required
                    name="phone"
                    margin="dense"
                    variant="outlined"
                    placeholder="Enter your phone number"
                    onChange={handleChange}
                    value={state}
                  />
                </div>
              </div>
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

export default PhoneModal