export const getAllJobs = (data) => ({
  type: 'GET_ALL_JOBS',
  payload: data,
});

export const setLoading = (data) => ({
  type: 'SET_LOADING',
  payload: data,
});

export const setAllJobs = (data) => ({
  type: 'SET_ALL_JOBS',
  payload: data,
});

export const getSingleJob = (data) => ({
  type: 'GET_SINGLE_JOB',
  payload: data,
});

export const setSingleJob = (data) => ({
  type: 'SET_SINGLE_JOB',
  payload: data,
});

export const updateJob = ({ data, id }) => ({
  type: 'UPDATE_JOB',
  payload: data,
  id
});

export const editJob = ({ data, id }) => ({
  type: 'EDIT_JOB',
  payload: data,
  id
});