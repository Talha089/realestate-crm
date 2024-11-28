import { PURGE } from "redux-persist";

var initialState = {
  allCampaign: null,
  accountDetails: {},
  accountWallet: [],
  accountTrades: [],
  accountHistory: [],
  campaignLogs: null,
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

    case 'SET_ALL_CAMPAIGNS':
      return {
        ...state,
        allCampaign: payload,
      };

    case 'UPDATE_CAMPAIGN_STATE':
      const updatedIndex = state.allCampaign.findIndex(el => el._id === payload._id);

      if (updatedIndex !== -1) {
        const updatedCampaign = [...state.allCampaign];
        updatedCampaign[updatedIndex] = payload;

        return {
          ...state,
          allCampaign: updatedCampaign
        };
      }

      return state;

    case 'ADD_CAMPAIGN':
      return {
        ...state,
        allCampaign: [payload, ...state.allCampaign],
      };

    case 'SET_CAMPAIGN_LOGS':
      return {
        ...state,
        campaignLogs: payload
      };

    case 'SET_SINGLE_CAMPAIGN':
      return {
        ...state
      };

    default:
      return state;
  }
};

export default Task;
