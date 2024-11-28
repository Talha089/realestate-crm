/* Hubspot */
export const getLists = () => ({
    type: 'GET_LISTS'
});
export const setLists = (data) => ({
    type: 'SET_LISTS',
    payload: data
});
export const createLists = () => ({
    type: 'CREATE_LISTS',
});
export const deleteList = (data) => ({
    type: 'DELETE_LIST',
    payload: data
});
export const completeList = (data) => ({
    type: 'COMPLETE_LIST',
    payload: data
});
export const hubspotTaskDone = (data) => ({
    type: 'HUBSPOT_TASK_DONE',
    payload: data
});

/* Instantly */
export const getCampaigns = () => ({
    type: 'GET_CAMPAIGNS',
});
export const setCampaigns = (data) => ({
    type: 'SET_CAMPAIGNS',
    payload: data
});
export const syncInstantlyLeads = (data) => ({
    type: 'SYNC_INSTANTLY_LEADS',
    payload: data
});

export const setLoading = (data) => ({
    type: 'SET_LOADING',
    payload: data
});

/* Twilio */
export const getTwilioToken = () => ({
    type: 'GET_TWILIO_TOKEN',
});
export const setTwilioToken = (data) => ({
    type: 'SET_TWILIO_TOKEN',
    payload: data
});
export const getCallingTask = () => ({
    type: 'GET_CALLING_TASK'
});
export const setCallingTask = (data) => ({
    type: 'SET_CALLING_TASK',
    payload: data
});
export const setCount = (data) => ({
    type: 'SET_COUNT',
    payload: data
});
export const setStart = (data) => ({
    type: 'SET_START',
    payload: data
});
export const setCallDone = (data) => ({
    type: 'SET_CALL_DONE',
    payload: data
});
export const callTaskCompleted = (data) => ({
    type: 'CALL_TASK_COMPLETED',
    payload: data
});
/* Leads */
export const createLead = (data) => ({
    type: 'CREATE_LEAD',
    payload: data
});

export const getLeads = () => ({
    type: 'GET_LEADS'
});



export const setLeads = (data) => ({
    type: 'SET_LEADS',
    payload: data
});

export const updateLead = (data) => ({
    type: 'SET_LEAD',
    payload: data
});

export const deleteLead = (data) => ({
    type: 'DELETE_LEAD',
    payload: data
});



