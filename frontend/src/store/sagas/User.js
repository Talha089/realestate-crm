import axios from 'axios';
import EventBus from 'eventing-bus';
import { all, takeEvery, call, put } from 'redux-saga/effects';

import { setAllUsers, setSingleUser, toggleIsActive, toggleIsPassword, toggleIsSMS, toggleIsTwoFA, setContactRequest } from '../actions/User.js';

function* getAllUsers() {
  const { error, response } = yield call(getCall, '/user');
  if (error) EventBus.publish("error", error['response']['data']['message']);
  else if (response) yield put(setAllUsers(response['data']['body']));
};

function* sendSms({ payload }) {
  const { successCallback, failCallback } = payload;
  const { error, response } = yield call(getCall, '/user/sendSMS');
  if (error) {
    failCallback();
    EventBus.publish("error", error['response']['data']['message']);
  } else if (response) successCallback();
};

function* sendEmail({ payload }) {
  const { successCallback, failCallback } = payload;
  const { error, response } = yield call(getCall, '/user/sendEmail');
  if (error) {
    failCallback();
    EventBus.publish("error", error['response']['data']['message']);
  } else if (response) successCallback();
};

function* enableSms({ payload }) {
  const { formData, successCallback, failCallback } = payload;
  const { error, response } = yield call(postCall, { path: '/user/enableSMS', payload: formData });
  if (error) {
    failCallback();
    EventBus.publish("error", error['response']['data']['message']);
  } else if (response) {
    successCallback();
    yield put({ type: "UPDATE_USER_STATE", payload: response['data']['body'] })
  }
};

function* enableEmail({ payload }) {
  const { formData, successCallback, failCallback } = payload;
  const { error, response } = yield call(postCall, { path: '/user/enableEmail', payload: formData });
  if (error) {
    failCallback()
    EventBus.publish("error", error['response']['data']['message']);
  } else if (response) {
    successCallback();
    yield put({ type: "UPDATE_USER_STATE", payload: response['data']['body'] })
  }
};

function* getSingleUser({ payload }) {
  const { error, response } = yield call(getCall, `/user/${payload}`);
  if (error) EventBus.publish("error", error['response']['data']['message']);
  else if (response) {
    yield put(setSingleUser(response['data']['body']));
    yield put(toggleIsActive(false));
    yield put(toggleIsPassword(false));
    yield put(toggleIsSMS(false));
    yield put(toggleIsTwoFA(false));
  }
};

function* createUser({ payload }) {
  const { successCallback, failCallback, formData } = payload;
  const { error, response } = yield call(postCall, { path: `/user`, payload: formData });
  if (error) {
    failCallback();
    EventBus.publish("error", error['response']['data']['message']);
  } else if (response) {
    successCallback();
    EventBus.publish("success", response['data']['message']);
    yield put({ type: 'ADD_USER', payload: response.data.body });
  }
};

function* updateProfile({ payload }) {
  const { successCallback, failCallback, formData } = payload;
  const { error, response } = yield call(patchCall, { path: `/user/updateProfile`, payload: formData });
  if (error) {
    failCallback();
    EventBus.publish("error", error['response']['data']['message']);
  } else if (response) {
    successCallback();
    EventBus.publish("success", response['data']['message']);
    yield put({ type: "SET_USER_DETAILS", payload: response['data']['body'] });
  }
};
function* updateUser({ payload }) {
  const { successCallback, failCallback, formData, id } = payload;
  const { error, response } = yield call(patchCall, { path: `/user/${id}`, payload: formData });
  if (error) {
    failCallback();
    EventBus.publish("error", error['response']['data']['message']);
  } else if (response) {
    successCallback();
    EventBus.publish("success", response['data']['message']);
    yield put({ type: 'UPDATE_USER_STATE', payload: response.data.body });
  }
};

function* deleteUser({ payload }) {
  const { error, response } = yield call(deleteCall, `/user/${payload}` );
  if (error) EventBus.publish("error", error['response']['data']['message']);
  else if (response) EventBus.publish("success", response['data']['message']);
  yield put({ type: 'GET_ALL_USERS' });
};

function* actionWatcher() {
  yield takeEvery('UPDATE_USER', updateUser);
  yield takeEvery('CREATE_USER', createUser);
  yield takeEvery('GET_ALL_USERS', getAllUsers);
  yield takeEvery('UPDATE_PROFILE', updateProfile);
  yield takeEvery('GET_SINGLE_USER', getSingleUser);

  yield takeEvery('DELETE_USER', deleteUser);

  yield takeEvery('SEND_SMS', sendSms);
  yield takeEvery('SEND_EMAIL', sendEmail);
  yield takeEvery('ENABLE_SMS', enableSms);
  yield takeEvery('ENABLE_EMAIL', enableEmail);
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
