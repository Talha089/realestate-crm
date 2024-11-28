
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Row, Card, CardHeader, CardBody, CardTitle } from "reactstrap";

import "./index.css"
import ReactTable from 'react-table-6';
import { withRouter } from 'react-router-dom';
import SendIcon from '@material-ui/icons/Send';
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import ContactsIcon from '@material-ui/icons/Contacts';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import PhoneIcon from '@material-ui/icons/Phone';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Button from '@material-ui/core/Button';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { createLead, getLeads, updateLead } from '../../store/actions/Integration';



const Integrations = () => {
  const dispatch = useDispatch();
  const { campaigns, lists, leads } = useSelector((state) => state['Integration']);

  const leadStatus = ['New', 'Contacted', 'Qualified', 'Lost', 'Closed'];

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Track if modal is in edit mode
  const [campaign, setCampaign] = useState('New');

  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    email: '',
    phone: '',
    status: 'New',
  });

  useEffect(() => {
    dispatch(getLeads());
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const openCreateModal = () => {
    setIsEditMode(false); // Switch to create mode
    setFormData({
      _id: '',
      name: '',
      email: '',
      phone: '',
      status: 'New'
    }); // Reset form data
    setModalOpen(true);
  };

  const openEditModal = (row) => {
    console.log('**** openEditModal', row)
    const { name, email, phone, status, _id } = row._original;
    setFormData({ name, email, phone, status, _id }); // Populate form data
    setIsEditMode(true); // Switch to edit mode
    setModalOpen(true);
  };

  const submitForm = async () => {
    if (isEditMode) {
      console.log('*** Editing Lead', formData);
      // Dispatch update action here (updateLead should be defined in your actions)
      await dispatch(updateLead(formData));
    } else {
      console.log('*** Creating New Lead', formData);
      dispatch(createLead(formData));
    }
    setModalOpen(false);
  };

  const instantlyCampaignColumns = [
    {
      minWidth: 200,
      Header: 'Lead Name',
      id: 'lead_name',
      accessor: (lead) => lead['name'] || '-',
    },
    {
      minWidth: 100,
      id: 'email_leads',
      Header: 'Email',
      accessor: (lead) => (
        <>
          <ContactsIcon className="icon-table-instaly" color="primary" /> &nbsp; {lead['email'] || 0}
        </>
      ),
    },
    {
      minWidth: 100,
      id: 'phone',
      Header: 'Phone',
      accessor: (lead) => (
        <>
          <PhoneIcon className="icon-table-instaly" color="primary" /> &nbsp; {lead['phone'] || 0}
        </>
      ),
    },
    {
      id: 'edit',
      Header: '',
      filterable: false,
      Cell: ({ row }) => (
        <>
          <Button onClick={() => openEditModal(row)} variant="outlined" color="primary">
            Edit
          </Button>
          <Button
            onClick={() => console.log('Delete', row._original)}
            variant="outlined"
            color="primary"
            className="delete-button"
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Row>
        <Card className="card-table">
          <CardHeader>
            <CardTitle tag="h3" style={{ margin: 20 }}>
              <div tag="h2">Instantly Campaigns</div>
              <button className="btn-style-one" onClick={openCreateModal}>
                Create New Lead
              </button>
            </CardTitle>
          </CardHeader>
          <CardBody>
            <ReactTable
              minRows={18}
              className="table"
              filterable={true}
              data={leads || []}
              columns={instantlyCampaignColumns}
              resolveData={(leads) => (leads ? leads.map((row) => row) : [])}
            />
          </CardBody>
        </Card>
      </Row>

      <Modal isOpen={modalOpen} className={`main-modal new-user-modal`}>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
          {isEditMode ? 'Edit Lead' : 'Create New Lead'}
        </ModalHeader>
        <ModalBody>
          <div className="content-area">
            <ValidatorForm className="validator-form mt-4" onSubmit={submitForm}>
              <div className="row">
                {/* Name and Email */}
                <div className="col-lg-6 col-md-6">
                  <div className="group-form">
                    <label>Name</label>
                    <TextValidator
                      className="login-input-fields"
                      type="text"
                      name="name"
                      margin="dense"
                      variant="outlined"
                      placeholder="Enter your name"
                      onChange={handleInputChange}
                      value={formData.name}
                      validators={['required']}
                      errorMessages={['Name cannot be empty']}
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="group-form">
                    <label>Email</label>
                    <TextValidator
                      className="login-input-fields"
                      type="text"
                      name="email"
                      margin="dense"
                      variant="outlined"
                      placeholder="Enter your email"
                      onChange={handleInputChange}
                      value={formData.email}
                      validators={['required', 'isEmail']}
                      errorMessages={['Email cannot be empty', 'Email is not valid']}
                    />
                  </div>
                </div>

                {/* Phone and Status */}
                <div className="col-lg-6 col-md-6">
                  <div className="group-form">
                    <label>Phone</label>
                    <TextValidator
                      className="login-input-fields"
                      type="text"
                      name="phone"
                      margin="dense"
                      variant="outlined"
                      placeholder="Enter your phone number"
                      onChange={handleInputChange}
                      value={formData.phone}
                      validators={['required']}
                      errorMessages={['Phone number cannot be empty']}
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="group-form">
                    <label>Status</label>
                    <Select
                      name="status"
                      id="instantly-status"
                      placeholder="Select status"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, status: e.target.value }))
                      }
                    >
                      {leadStatus.map((status) => (
                        <MenuItem value={status} key={status}>
                          <span className={`${status.toLowerCase()}-status font-bold`}>
                            {status.toUpperCase()}
                          </span>
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="col-12">
                  <div className="group-form text-center">
                    <button className="btn-style-one">{isEditMode ? 'Update' : 'Submit'}</button>
                  </div>
                </div>
              </div>
            </ValidatorForm>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default withRouter(Integrations);
