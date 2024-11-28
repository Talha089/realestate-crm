export const getAllCampaign = () => ({
  type: 'GET_ALL_CAMPAIGNS',
});

export const setLoading = (data) => ({
  type: 'SET_LOADING',
  payload: data,
});

export const setAllCampaign = (data) => ({
  type: 'SET_ALL_CAMPAIGNS',
  payload: data,
});

export const getSingleTask = (data) => ({
  type: 'GET_SINGLE_CAMPAIGN',
  payload: data,
});

export const setSingleTask = (data) => ({
  type: 'SET_SINGLE_CAMPAIGN',
  payload: data,
});

export const getCampaignLogs = (data) => ({
  type: 'GET_CAMPAIGN_LOGS',
  payload: data,
});

export const setCampaignLogs = (data) => ({
  type: 'SET_CAMPAIGN_LOGS',
  payload: data,
});

export const deleteSingleCampaign = (data) => ({
  type: 'DELETE_SINGLE_CAMPAIGN',
  payload: data,
});

export const updateStatus = (data) => ({
  type: 'UPDATE_STATUS',
  payload: data,
});

export const createTask = ({ data, successCallback, failCallback }) => ({
  type: 'CREATE_CAMPAIGN',
  payload: {
    formData: data,
    successCallback,
    failCallback
  }
})

export const updateTask = ({ id, data, successCallback, failCallback }) => ({
  type: 'UPDATE_CAMPAIGN',
  payload: {
    id,
    formData: data,
    successCallback,
    failCallback
  }
})

export const editTask = ({ data, id }) => ({
  type: 'EDIT_CAMPAIGN',
  payload: data,
  id
});