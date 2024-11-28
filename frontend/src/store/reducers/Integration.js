import { PURGE } from "redux-persist";

var initialState = {
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
