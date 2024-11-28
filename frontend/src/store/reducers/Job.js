import { PURGE } from "redux-persist";

var initialState = {
  totalJobs: 0,
  allJobs: null,
  jobDetails: {},
  jobWallet: [],
  jobTrades: [],
  jobHistory: [],
  isLoading: false,
}

const Job = (state = initialState, { type, payload }) => {
  switch (type) {
    case PURGE: return initialState;

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: payload,
      };

    case 'SET_ALL_JOBS':
      return {
        ...state,
        totalJobs: payload.totalJobs,
        allJobs: payload.jobs,
      };

    case 'SET_SINGLE_JOB':
      return {
        ...state
      };

    default:
      return state;
  }
};

export default Job;
