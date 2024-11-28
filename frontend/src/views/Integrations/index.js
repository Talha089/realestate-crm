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

import { createLead, getLeads } from '../../store/actions/Integration';



const Integrations = () => {

  const dispatch = useDispatch();
  const { campaigns, lists, leads } = useSelector(state => state['Integration']);

  const leadStatus = ['New', 'Contacted', 'Qualified', "Lost", "Closed"];

  const [modalOpen, setModalOpen] = useState(false);
  const [list, setList] = useState({});
  const [campaign, setCampaign] = useState('New');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'New',
  });


  useEffect(() => {
    if (leads) console.log('**** leads', leads)
  }, [leads])

  useEffect(() => {
    dispatch(getLeads())
  }, [])


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };



  const instantlyCampaignColumns = [{
    minWidth: 200,
    Header: 'Lead Name',
    id: 'lead_name',
    accessor: lead => lead['name'] || '-'
  }, {
    minWidth: 100,
    id: 'email_leads',
    Header: 'Email',
    accessor: lead => <><ContactsIcon className='icon-table-instaly' color="primary" /> &nbsp; {lead['email'] || 0}</>
  }, {
    minWidth: 100,
    id: 'phone',
    Header: 'Phone',
    accessor: lead => <><PhoneIcon className='icon-table-instaly' color="primary" /> &nbsp; {lead['phone'] || 0}</>
  },
  {
    minWidth: 100,
    id: 'Date',
    Header: 'Created At',
    accessor: lead => <><EventAvailableIcon className='icon-table-instaly' color="primary" /> &nbsp; {lead['createdAt'] || 0}</>
  },

  {
    id: 'status',
    minWidth: 100,
    Header: 'Status',
    accessor: campaign =>
      <div className='content-area'>
        <button className={`status-btn ${campaign['status'].toLowerCase()}-btn`}>{campaign['status'].toUpperCase()}</button>
      </div>,
    filterable: false,
  },
  {
    id: 'edit',
    Header: '',
    filterable: false,
    Cell: ({ row }) => (
      <>
        <Button onClick={() => editRow(row)} variant="outlined" color="primary">Edit</Button>
        <Button onClick={() => deleteRow(row)} variant="outlined" color="primary" className='delete-button'>Delete</Button>
      </>
    )

  },
  ];


  const editRow = async (row) => {
    const { name, email, phone, status, createdAt } = row._original;
    // setState({ ...state, name, phone, email, status });
    setFormData(name, email, phone, status)
    dispatch(toggleEditAllowistModal(true));
  };


  const handleButton = () => {
    setModalOpen(true);
  };

  const submitForm = async () => {
    console.log('*** submitForm called', formData)
    await dispatch(createLead(formData));
  }


  return (
    <>
      <Row>
        <Card className="card-table">
          <CardHeader>
            <CardTitle tag="h3" style={{ margin: 20 }}>
              <div tag="h2">Instantly Campaigns</div>
              <button className="btn-style-one" onClick={() =>
                handleButton()
              } >
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
              resolveData={leads => leads ? leads.map(row => row) : []}
            />
          </CardBody>
        </Card>
      </Row>

      <Modal isOpen={modalOpen} className={`main-modal new-user-modal`}>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}></ModalHeader>
        <ModalBody>
          <div className='content-area'>
            <ValidatorForm className="validator-form mt-4" onSubmit={() => submitForm()}>
              <div className='row'>
                {/* First Row: Name and Email */}
                <div className='col-lg-6 col-md-6'>
                  <div className="group-form">
                    <label>Name</label>
                    <TextValidator
                      className="login-input-fields"
                      type="text"
                      name="name"
                      margin="dense"
                      variant="outlined"
                      placeholder="Enter your name"
                      onChange={(e) => handleInputChange(e)}
                      value={formData.name}
                      validators={['required']}
                      errorMessages={['Name cannot be empty']}
                    />
                  </div>
                </div>

                <div className='col-lg-6 col-md-6'>
                  <div className="group-form">
                    <label>Email</label>
                    <TextValidator
                      className="login-input-fields"
                      type="text"
                      name="email"
                      margin="dense"
                      variant="outlined"
                      placeholder="Enter your email"
                      onChange={(e) => handleInputChange(e)}
                      value={formData.email}
                      validators={['required', 'isEmail']}
                      errorMessages={['Email cannot be empty', 'Email is not valid']}
                    />
                  </div>
                </div>

                {/* Second Row: Phone and Status */}
                <div className='col-lg-6 col-md-6'>
                  <div className="group-form">
                    <label>Phone</label>
                    <TextValidator
                      className="login-input-fields"
                      type="text"
                      name="phone"
                      margin="dense"
                      variant="outlined"
                      placeholder="Enter your phone number"
                      onChange={(e) => handleInputChange(e)}
                      value={formData.phone}
                      validators={['required']}
                      errorMessages={['Phone number cannot be empty']}
                    />
                  </div>
                </div>

                <div className='col-lg-6 col-md-6'>
                  <div className="group-form">
                    <div></div>
                    <label>Status</label>
                    <Select
                      name='campaign'
                      id='instantly-campaign'
                      placeholder='Search your campaign'
                      labelId='instantly-campaign-label'
                      value={campaign}
                      onChange={(e) => setCampaign(e['target']['value'])}
                    >
                      {leadStatus.length > 0 && leadStatus.map(campaign =>
                        <MenuItem value={campaign}
                          className='text-center'>
                          {/* {campaign} &nbsp; - &nbsp; */}
                          <span className={`${campaign}-status font-bold`}>
                            {campaign.toUpperCase()}</span>
                        </MenuItem>)
                      };
                    </Select>
                  </div>
                </div>

                {/* Submit Button */}
                <div className='col-12'>
                  <div className="group-form text-center">
                    <button className="btn-style-one" >
                      Submit
                    </button>
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