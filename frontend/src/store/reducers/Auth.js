import { PURGE } from "redux-persist";
import { setToken } from '../axios';

var initialState =
{
  isLogin: false,
  role: localStorage.getItem('role'),
  auth: localStorage.getItem('token'),

  isAdminPassword: true,

  dashboardStats: {
    total_leads: 0,
    new_leads: 0,
    contacted_leads: 0,
    qualified_leads: 0,
    lost_leads: 0,
    closed_leads: 0,
    leads_stats_0: 0,
    leads_stats_1: 0,


    total_jobs: 2500,
    
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
