import { PURGE } from "redux-persist";

var initialState = {
  allAccounts: null,
  accountDetails: {},
  accountWallet: [],
  accountTrades: [],
  accountHistory: [],
  isLoading: false,
}

const Account = (state = initialState, { type, payload }) => {
  switch (type) {
    case PURGE: return initialState;

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: payload,
      };

    case 'SET_ALL_ACCOUNTS':
      return {
        ...state,
        allAccounts: payload,
      };


    case 'UPDATE_ACCOUNT_STATE':
      const updatedIndex = state.allAccounts.findIndex(el => el._id === payload._id);

      if (updatedIndex !== -1) {
        const updatedAccounts = [...state.allAccounts];
        updatedAccounts[updatedIndex] = payload;

        return {
          ...state,
          allAccounts: updatedAccounts
        };
      }

      return state;

    case 'ADD_ACCOUNT':
      return {
        ...state,
        allAccounts: [payload, ...state.allAccounts],
      };

    case 'SET_SINGLE_ACCOUNT':
      return {
        ...state
      };

    default:
      return state;
  }
};

export default Account;
