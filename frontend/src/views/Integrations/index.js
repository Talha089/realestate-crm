
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Row, Card, CardHeader, CardBody, CardTitle } from "reactstrap";
import moment from 'moment';

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

import { createLead, getLeads, updateLead, deleteLead } from '../../store/actions/Integration';



const Integrations = () => {
  const dispatch = useDispatch();
  const { leads } = useSelector((state) => state['Integration']);

  const leadStatus = ['New', 'Contacted', 'Qualified', 'Lost', 'Closed'];

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false); // Track if modal is in edit mode

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
    console.log(e.target.value)
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

  const openDeleteModal = (row) => {
    const { name, email, phone, status, _id } = row._original;
    setFormData({ name, email, phone, status, _id }); // Populate form data
    // setIsEditMode(true); // Switch to edit mode
    setDeleteModalOpen(true);
  }

  const submitForm = async () => {
    if (isEditMode) {
      // Dispatch update action here (updateLead should be defined in your actions)
      dispatch(updateLead(formData));
    } else {
      dispatch(createLead(formData));
    }
    setModalOpen(false);
  };

  const confirmDeleteHandler = async () => {
    dispatch(deleteLead(formData));
    setDeleteModalOpen(false);
  }

  const cancelDeleteHandler = async () => {
    setDeleteModalOpen(false);

  }


  const instantlyCampaignColumns = [
    {
      minWidth: 200,
      Header: 'Lead Name',
      id: 'lead_name',
      accessor: 'name', // Use the string key for filtering
      Cell: ({ value }) => value || '-', // Handle display of empty names here
      filterMethod: (filter, row) => {
        const name = row[filter.id] || ''; // Ensure name is a string
        return name.toLowerCase().includes(filter.value.toLowerCase());
      },
    },
    
    {
      minWidth: 100,
      id: 'email_leads',
      Header: 'Email',
      accessor: 'email', // Use plain text data for filtering
      filterMethod: (filter, row) => {
        const email = row[filter.id] || ''; // Ensure email is not undefined
        return email.toLowerCase().includes(filter.value.toLowerCase());
      },
      Cell: ({ value }) => (
        <>
          <ContactsIcon className="icon-table-instaly" color="primary" /> &nbsp; {value || '-'}
        </>
      ),
    },
    {
      minWidth: 100,
      id: 'phone',
      Header: 'Phone',
      accessor: 'phone', // Use key directly for easier filtering
      filterMethod: (filter, row) => {
        const phone = row[filter.id] || ''; // Get the phone value
        return phone.toLowerCase().includes(filter.value.toLowerCase());
      },
      Cell: ({ row }) => (
        <>
          <PhoneIcon className="icon-table-instaly" color="primary" /> &nbsp; {row.phone || '-'}
        </>
      ),
    },
    {
      minWidth: 100,
      id: 'status',
      Header: 'Status',
      accessor: (lead) => lead['status'] || '-',
    },
    {
      minWidth: 100,
      id: 'time',
      Header: 'Date',
      accessor: (lead) => moment(lead['createdAt']).format('YYYY-MM-DD')

    },
    {
      id: 'edit',
      Header: 'Actions',
      filterable: false,
      Cell: ({ row }) => (
        <>
          <button onClick={() => openEditModal(row)} variant="outlined" color="primary" className='mx-1 view-btn user-view-btn'>
            <i className='tim-icons icon-pencil' />
          </button>
          <button
            onClick={() => openDeleteModal(row)} variant="outlined" color="primary" className="mx-1 delete-btn"

          >
            <i className="fa fa-trash success px-2" aria-hidden="true"></i>
          </button>
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
              <div tag="h2">Real Estate Leads</div>
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
      {/* Create Edit Modal */}
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
                      // onChange={(e) =>
                      //   setFormData((prev) => ({ ...prev, status: e.target.value }))
                      // }

                      onChange={handleInputChange}
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

      {/* Delete Modal */}


      <Modal isOpen={deleteModalOpen} className={`main-modal new-user-modal`}>
        <ModalHeader toggle={() => setDeleteModalOpen(!deleteModalOpen)}>
          <h3>Are you sure you want to delete this lead ?</h3>
        </ModalHeader>
        <ModalBody>
          <div className="content-area">
            <ValidatorForm className="validator-form mt-4" >
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
                      // onChange={handleInputChange}
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
                      // onChange={handleInputChange}
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
                      // onChange={handleInputChange}
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
                    // onChange={(e) =>
                    //   setFormData((prev) => ({ ...prev, status: e.target.value }))
                    // }
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
                    <button className="btn-style-one" onClick={confirmDeleteHandler}>{"Yes"}</button>
                    <button className="btn-style-one" onClick={cancelDeleteHandler}>{"No"}</button>
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
