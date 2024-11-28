import ReactTable from 'react-table-6';
import React, { useState, useEffect, Fragment } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Card, CardHeader, CardBody, CardTitle } from "reactstrap";

import './index.css';
import UserModal from './userModal';
import Loader from '../../components/Loader';
import filterCaseInsensitive from '../../functions/filter-insensitive';
import { createUser, getAllUsers, updateUser, deleteUser } from '../../store/actions/User.js';


const initialFormState = {
  name: '',
  role: '',
  email: '',
  isActive: true
}
const Users = (props) => {
  const dispatch = useDispatch()

  const { allUsers } = useSelector(st => st.User);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isNewUserModal, setIsNewUserModal] = useState(false);
  const [isEditUserModal, setIsEditUserModal] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [editState, setEditState] = useState({ id: null, ...initialFormState });
  const [addState, setAddState] = useState({ ...initialFormState, password: '' });

  useEffect(() => {
    if (!allUsers) dispatch(getAllUsers());
  }, [allUsers])

  const toggleNewUserModal = () => setIsNewUserModal(st => !st);
  const toggleEditUserModal = (el) => {
    setEditState({
      id: el._id,
      name: el.name,
      email: el.email,
      role: el.role,
      isActive: el.isActive
    });
    setIsEditUserModal(true);
  };

  const handleStatusChange = (el, active) => {
    console.log("active", active)
    setIsUpdatingStatus(el._id);
    dispatch(updateUser({
      data: { isActive: active }, id: el._id,
      failCallback: () => setIsUpdatingStatus(false),
      successCallback: () => setIsUpdatingStatus(false),
    }))
  };

  const handleChange = e => setEditState(st => ({ ...st, [e.target?.name]: e.target?.value }));
  const handleAddChange = e => setAddState(st => ({ ...st, [e.target?.name]: e.target?.value }));

  const handleEditSubmit = e => {
    e.preventDefault();
    setIsEditing(true)
    dispatch(updateUser({
      data: {
        name: editState.name,
        email: editState.email,
        role: editState.role,
        isActive: editState.isActive
      },
      id: editState.id,
      successCallback: () => {
        setIsEditing(false);
        setIsEditUserModal(false);
      }, failCallback: () => setIsEditing(false)
    }))
  };

  const handleAddSubmit = e => {
    e.preventDefault();
    setIsAddingUser(true)
    dispatch(createUser({
      data: {
        name: addState.name,
        email: addState.email,
        role: addState.role,
        password: addState.password,
        isActive: editState.isActive
      },
      successCallback: () => {
        setIsNewUserModal(false)
        setIsAddingUser(false)
        setAddState({
          ...initialFormState,
          password: ''
        })
      },
      failCallback: () => {
        setIsAddingUser(false)
      }
    }))
  };

  const columns = [
    {
      id: 'name',
      Header: 'Name',
      accessor: allUsers => allUsers['name'] ? allUsers['name'] : '-',
    }, {
      id: 'email',
      Header: 'Email',
      accessor: allUsers => allUsers['email'] ? allUsers['email'] : '-',
    }, {
      id: 'role',
      Header: 'Role',
      accessor: allUsers => allUsers['role'] ? allUsers['role'] : '-',
    }, {
      id: 'status',
      Header: 'Status',
      accessor: allUsers =>
        <Fragment>
          <div className='content-area'>
            <div className='left-area'>
              {allUsers['isActive'] ?
                <button className='status-btn inprogress-btn'>Active</button>
                :
                <button className='status-btn reject-btn'>DeActivated</button>
              }
            </div>

          </div>
        </Fragment>,
      filterable: false,
    }, {
      id: 'actions',
      Header: 'Action',
      accessor: user =>
        <Fragment>
          <div className='content-area'>
            {/* <div className='left-area'>
              <FormControl fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={isUpdatingStatus === user._id ? 'loading' : user['isActive']}
                  label="Age"
                  placeholder='Disable a Agent'
                  onChange={(e) => {
                    handleStatusChange(user, e.target.value)
                  }}
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Deactivate</MenuItem>
                  <MenuItem value={'loading'} style={{ display: 'none' }}>
                    <CircularProgress size={20} />
                  </MenuItem>
                </Select>
              </FormControl>
            </div> */}
            <button to="#" className="mx-1 view-btn user-view-btn" onClick={() => toggleEditUserModal(user)}>
              <i className='tim-icons icon-pencil' />
            </button>
            <button className="mx-1 delete-btn" onClick={() => dispatch(deleteUser(user['_id']))}>
              <i className="fa fa-trash success px-2" aria-hidden="true"></i>
            </button>
          </div>
        </Fragment>,
      filterable: false,
    }
  ];

  return (
    <div className='content'>
      <div className="main-container">
        {!allUsers
          ? <Card className="card-table loader-spinner"><Loader /></Card>
          : <Card className="card-table">
            <CardHeader>
              <CardTitle tag="h3" style={{ marginBottom: 0 }}>
                <div tag="h2">All Users Details</div>
                <button className='btn-style-one' onClick={toggleNewUserModal}>Create a User</button>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <ReactTable
                className="table"
                data={allUsers}
                resolveData={allUsers => allUsers.map(row => row)}
                columns={columns}
                minRows={8}
                filterable={true}
                defaultFilterMethod={filterCaseInsensitive}
              />
            </CardBody>
          </Card>
        }
      </div>


      <UserModal isOpen={isNewUserModal} setOpen={setIsNewUserModal}
        title={'Create User'} handleChange={handleAddChange} handleSubmit={handleAddSubmit}
        state={addState} isSubmitting={isAddingUser} />

      <UserModal isOpen={isEditUserModal} setOpen={setIsEditUserModal}
        title={'Edit User'} handleChange={handleChange} handleSubmit={handleEditSubmit}
        state={editState} isSubmitting={isEditing} />
    </div>
  );
}

const mapDispatchToProps = {
  // getAllUsers,
};

const mapStateToProps = ({ User }) => {
  let { } = User
  return {}
};
export default connect(mapStateToProps, mapDispatchToProps)(Users);