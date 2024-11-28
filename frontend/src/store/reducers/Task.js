import { PURGE } from "redux-persist";

var initialState = {
  allTasks: null,
  accountDetails: {},
  accountWallet: [],
  accountTrades: [],
  accountHistory: [],
  isLoading: false,
}

const Task = (state = initialState, { type, payload }) => {
  switch (type) {
    case PURGE: return initialState;

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: payload,
      };

    case 'SET_ALL_TASKS':
      return {
        ...state,
        allTasks: payload,
      };

    case 'UPDATE_TASK_STATE':
      const updatedIndex = state.allTasks.findIndex(el => el._id === payload._id);

      if (updatedIndex !== -1) {
        const updatedTasks = [...state.allTasks];
        updatedTasks[updatedIndex] = payload;

        return {
          ...state,
          allTasks: updatedTasks
        };
      }

      return state;

    case 'ADD_TASK':
      return {
        ...state,
        allTasks: [payload, ...state.allTasks],
      };

    case 'SET_SINGLE_TASK':
      return {
        ...state
      };

    default:
      return state;
  }
};

export default Task;
