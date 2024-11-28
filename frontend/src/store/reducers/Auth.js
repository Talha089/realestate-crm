import { PURGE } from "redux-persist";
import { setToken } from '../axios';

var initialState =
{
  isLogin: false,
  role: localStorage.getItem('role'),
  auth: localStorage.getItem('token'),

  isAdminPassword: true,

  dashboardStats: {
    total_jobs: 2500,
    total_users: 0,
    total_tasks: 0,
    totalDeposits: 1,
    totalWithdrawals: 1,
    job_stats: null,
    applied_job_stats: null,
    platform_job_stats: null,
    TotalJob: {
      labels: ["15 - August", "16 - August", "17 - August", "18 - August", "19 - August", "20 - August", "21 - August", "22 - August", "23 - August", "24 - August", "25 - August",],
      data: [1, 6, 22, 11, 60, 202, 110, 40, 102, 1, 140,],
    },
    TotalApplys: {
      labels: ["16 - August", "17 - August", "20 - August",],
      data: [8, 40, 8,],
    },
  },
}

const Auth = (state = initialState, { type, payload }) => {
  switch (type) {
    case PURGE: return initialState;

    /*========== LOGIN REDUCERS ============= */

    case 'TOGGLE_LOGIN':
      return {
        ...state,
        isLogin: !state.isLogin,
      };

    case 'SAVE_LOGIN_DATA':
      setToken(payload['token']);
      localStorage.setItem('role', payload['role']);
      localStorage.setItem('token', payload['token']);
      return {
        ...state,
        role: payload['role'],
        auth: payload['token'],
      };

    case 'SET_DASHBOARD_STATS':
      return {
        ...state,
        dashboardStats: {
          ...state.dashboardStats,
          ...payload
        }
      };

    case 'LOGOUT':
      setToken();
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      return {
        ...state,
        auth: '',
        role: '',
      };

    /*========== DASHBOARD REDUCERS ============= */


    default:
      return state;
  }
};
export default Auth;
