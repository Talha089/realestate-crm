import axios from 'axios';
import EventBus from 'eventing-bus';
import { all, takeEvery, call, put } from 'redux-saga/effects';

import { setAllJobs, setSingleJob, toggleIsActive, toggleIsPassword, toggleIsSMS, toggleIsTwoFA, setContactRequest } from '../actions/Job.js';

function* getAllJobs({ payload }) {
  const { error, response } = yield call(postCall, { path: '/jobs', payload });
  if (error) EventBus.publish("error", error['response']['data']['message']);
  else if (response) yield put(setAllJobs(response['data']['body']));
};

function* getSingleJob({ payload }) {
  const { error, response } = yield call(getCall, `/job/${payload}`);
  if (error) EventBus.publish("error", error['response']['data']['message'])
  else if (response) {
    yield put(setSingleJob(response['data']['body']));

  }
};

function* updateJob({ payload, id }) {
  const { error, response } = yield call(putCall, { path: `/job/${id}`, payload });
  if (error) EventBus.publish("error", error['response']['data']['message']);
  else if (response) {
    EventBus.publish("success", response['data']['message']);
    yield put({ type: 'GET_SINGLE_JOB', payload: id });
  }
};


function* editJob({ payload, id }) {
  const { error, response } = yield call(putCall, { path: `/updateJob/${id}`, payload });
  if (error) EventBus.publish("error", error['response']['data']['message']);
  else if (response) {
    EventBus.publish("success", response['data']['message']);
    yield put({ type: 'GET_SINGLE_JOB', payload: id });
  }
};


function* actionWatcher() {
  yield takeEvery('GET_ALL_JOBS', getAllJobs);
  yield takeEvery('GET_SINGLE_JOB', getSingleJob);
  yield takeEvery('UPDATE_JOB', updateJob);
  yield takeEvery('EDIT_JOB', editJob);
}

export default function* rootSaga() {
  yield all([actionWatcher()]);
}

function postCall({ path, payload }) {
  return axios
    .post(path, payload)
    .then(response => ({ response }))
    .catch(error => {
      if (error.response.status === 401) EventBus.publish("tokenExpired");
      return { error };
    });
}

function getCall(path) {
  return axios
    .get(path)
    .then(response => ({ response }))
    .catch(error => {
      if (error.response.status === 401) EventBus.publish("tokenExpired");
      return { error };
    });
}

function deleteCall(path) {
  return axios
    .delete(path)
    .then(response => ({ response }))
    .catch(error => {
      if (error.response.status === 401) EventBus.publish("tokenExpired");
      return { error };
    });
}

function putCall({ path, payload }) {
  return axios
    .put(path, payload)
    .then(response => ({ response }))
    .catch(error => {
      if (error.response.status === 401) EventBus.publish("tokenExpired");
      return { error };
    });
}
