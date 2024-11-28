export const getAllUsers = () => ({
  type: 'GET_ALL_USERS',
});

export const setLoading = (data) => ({
  type: 'SET_LOADING',
  payload: data,
});

export const setAllUsers = (data) => ({
  type: 'SET_ALL_USERS',
  payload: data,
});

export const getSingleUser = (data) => ({
  type: 'GET_SINGLE_USER',
  payload: data,
});

export const setSingleUser = (data) => ({
  type: 'SET_SINGLE_USER',
  payload: data,
});

export const getMe = () => ({
  type: 'GET_ME',
});

export const updateProfile = (data) => ({
  type: 'UPDATE_PROFILE',
  payload: data
});

export const sendSms = (data) => ({
  type: 'SEND_SMS',
  payload: data
});

export const sendEmail = (data) => ({
  type: 'SEND_EMAIL',
  payload: data
});

export const enableSms = (data) => ({
  type: 'ENABLE_SMS',
  payload: data
});

export const enableEmail = (data) => ({
  type: 'ENABLE_EMAIL',
  payload: data
});

export const deleteUser = (data) => ({
  type: 'DELETE_USER',
  payload: data
});

export const updateUser = ({ data, id, successCallback, failCallback }) => ({
  type: 'UPDATE_USER',
  payload: {
    id,
    failCallback,
    formData: data,
    successCallback,
  }
});

export const createUser = ({ data, successCallback, failCallback }) => ({
  type: 'CREATE_USER',
  payload: {
    formData: data,
    successCallback,
    failCallback
  }
});

export const toggleIsActive = (data) => ({
  type: 'TOGGLE_IS_ACTIVE',
  payload: data
});

export const toggleIsPassword = (data) => ({
  type: 'TOGGLE_IS_PASSWORD',
  payload: data
});

export const toggleIsSMS = (data) => ({
  type: 'TOGGLE_IS_SMS',
  payload: data
});

export const toggleIsTwoFA = (data) => ({
  type: 'TOGGLE_IS_TWO_FA',
  payload: data
});

export const getContactRequest = () => ({
  type: 'GET_CONTACT_REQUEST',
});

export const setContactRequest = (data) => ({
  type: 'SET_CONTACT_REQUEST',
  payload: data,
});

export const resolveTicket = ({ data }) => ({
  type: 'RESOLVE_TICKET',
  payload: data,
});

export const editUser = ({ data, id }) => ({
  id,
  payload: data,
  type: 'EDIT_USER',
});