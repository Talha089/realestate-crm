export const getAllAccounts = () => ({
  type: 'GET_ALL_ACCOUNTS',
});

export const setLoading = (data) => ({
  type: 'SET_LOADING',
  payload: data,
});

export const setAllAccounts = (data) => ({
  type: 'SET_ALL_ACCOUNTS',
  payload: data,
});

export const getSingleAccount = (data) => ({
  type: 'GET_SINGLE_ACCOUNT',
  payload: data,
});

export const setSingleAccount = (data) => ({
  type: 'SET_SINGLE_ACCOUNT',
  payload: data,
});

export const createAccount = ({ data, successCallback, failCallback }) => ({
  type: 'CREATE_ACCOUNT',
  payload: {
    formData: data,
    successCallback,
    failCallback
  }
});


export const updateAccount = (data) => ({
  type: 'UPDATE_ACCOUNT',
  payload: data,
});

export const editAccount = ({ data, id }) => ({
  type: 'EDIT_ACCOUNT',
  payload: data,
  id
});