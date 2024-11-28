/*========== LOGIN ACTIONS ============= */


export const signup = ({ data, history }) => ({
  type: 'SIGN_UP',
  payload: data,
  history,
});

export const login = ({ data, history }) => ({
  type: 'LOGIN',
  payload: data,
  history,
});

export const toggleLogin = () => ({
  type: 'TOGGLE_LOGIN',
});

export const getDashboardStats = () => ({
  type: 'GET_DASHBOARD_STATS',
});

export const saveloginData = (data) => ({
  type: 'SAVE_LOGIN_DATA',
  payload: data,
});

export const changePassword = ({ formData, successCallback, failCallback }) => ({
  type: 'CHANGE_PASSWORD',
  payload: {
    formData,
    successCallback,
    failCallback
  },
});


export const resetPassword = ({ formData, successCallback, failCallback }) => ({
  type: 'RESET_PASSWORD',
  payload: {
    formData,
    successCallback,
    failCallback
  },
});

export const forgotPassword = (data) => ({
  type: 'FORGOT_PASSWORD',
  payload: data,
});

export const logout = () => ({
  type: 'LOGOUT'
});

/*========== DASHBOARD ACTIONS ============= */



