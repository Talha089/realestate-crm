import axios from 'axios';
import EventBus from 'eventing-bus';
import { all, takeEvery, call, put } from 'redux-saga/effects';

import { setAllAccounts, setSingleAccount } from '../actions/Account.js';

function* getAllAccounts() {
  const { error, response } = yield call(getCall, '/account');
  if (error) EventBus.publish("error", error['response']['data']['message'])
  else if (response) yield put(setAllAccounts(response['data']['body']));
};

function* getSingleAccount({ payload }) {
  const { error, response } = yield call(getCall, `/account/${payload}`);
  if (error) EventBus.publish("error", error['response']['data']['message']);
  else if (response) yield put(setSingleAccount(response['data']['body']));
};

function* createAccount({ payload }) {
  const { successCallback, formData } = payload;
  const { error, response } = yield call(postCall, { path: `/account`, payload: formData });
  if (error) {
    failback();
    EventBus.publish("error", error['response']['data']['message'])
  } else if (response) {
    successCallback();
    EventBus.publish("success", response['data']['message']);
    yield put({ type: 'ADD_ACCOUNT', payload: response.data.body });
  }
};

function* updateAccount({ payload }) {
  const { id, formData, successCallback, failCallback } = payload;
  const { error, response } = yield call(patchCall, { path: `/account/${id}`, payload: formData });
  if (error) {
    failback();
    EventBus.publish("error", error['response']['data']['message']) || 'Something went Wrong'
  }
  else if (response) {
    successCallback();
    EventBus.publish("success", response['data']['message']);
    yield put({ type: 'GET_ALL_ACCOUNTS' });
  }
};

function* editAccount({ payload, id }) {
  const { error, response } = yield call(putCall, { path: `/updateAccount/${id}`, payload });
  if (error) EventBus.publish("error", error['response']['data']['message']) || 'Something went Wrong'
  else if (response) {
    EventBus.publish("success", response['data']['message']);
    yield put({ type: 'GET_SINGLE_ACCOUNT', payload: id });
  }
};


function* actionWatcher() {
  yield takeEvery('GET_ALL_ACCOUNTS', getAllAccounts);
  yield takeEvery('GET_SINGLE_ACCOUNT', getSingleAccount);
  yield takeEvery('UPDATE_ACCOUNT', updateAccount);
  yield takeEvery('EDIT_ACCOUNT', editAccount);
  yield takeEvery('CREATE_ACCOUNT', createAccount);

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


function patchCall({ path, payload }) {
  return axios
    .patch(path, payload)
    .then(response => ({ response }))
    .catch(error => {
      if (error.response.status === 401) EventBus.publish("tokenExpired");
      return { error };
    });
}
