import { PURGE } from "redux-persist";

var initialState = {
    count: 0,
    lists: [],
    start: true,
    callTasks: [],
    campaigns: [],
    callHistory: [],
    twilioToken: '',
    isLoading: false,
    leads: []
}

const Integration = (state = initialState, { type, payload }) => {
    switch (type) {
        case PURGE:
            return initialState;

        case 'SET_LOADING':
            return {
                ...state,
                isLoading: payload,
            };
        case 'SET_LISTS':
            return {
                ...state,
                lists: payload,
            };
        case 'SET_CAMPAIGNS':
            return {
                ...state,
                campaigns: payload,
            };

        case 'SET_TWILIO_TOKEN':
            return {
                ...state,
                twilioToken: payload
            }
        case 'SET_CALLING_TASK':
            return {
                ...state,
                callTasks: payload
            }
        case 'SET_COUNT':
            return {
                ...state,
                count: payload
            }
        case 'SET_START':
            return {
                ...state,
                start: payload
            }
        case 'SET_LEADS':
            return {
                ...state,
                leads: payload
            }
        default:
            return state;
    }
};

export default Integration;
