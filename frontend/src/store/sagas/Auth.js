import axios from 'axios';
import jwt_decode from 'jwt-decode';
import EventBus from 'eventing-bus';
import { all, takeEvery, call, put } from 'redux-saga/effects';

import { saveloginData } from '../actions/Auth';

/*========== LOGIN FUNCTIONS =============*/

function* login({ payload, history }) {
  const { error, response } = yield call(postCall, { path: '/user/auth', payload });
  if (error) EventBus.publish("error", error['response']['data']['message']);
  else if (response) {
    // const decoded = jwt_decode(response["data"]["body"]["token"]);
    // if (decoded["role"] !== "admin") {
    //   EventBus.publish("error", "Can't login through User account ");
    //   yield put({ type: "TOGGLE_LOGIN" });
    //   return;
    // }
    yield put(saveloginData(response['data']['body']));
    yield put({ type: "SET_USER_DETAILS", payload: response['data']['body']['user'] });
    EventBus.publish("success", response['data']['message'])
    setTimeout(() => history.push('/home'), 1000);
  }
  yield put({ type: "TOGGLE_LOGIN" });
};


function* signup({ payload, history }) {
  console.log('****** Saga history', history);

  const { error, response } = yield call(postCall, { path: '/user/signup', payload });
  // if (error) {
  //   failCallback()
  //   EventBus.publish("error", error['response']['data']['message']);
  // }
  // else if (response) {
  //   EventBus.publish("success", response['data']['message'])
  //   successCallback();
  // }

  if (error) {
    EventBus.publish("error", error['response']['data']['message']);
  
  }
  else if (response) {
    // const decoded = jwt_decode(response["data"]["body"]["token"]);
    // if (decoded["role"] !== "admin") {
    //   EventBus.publish("error", "Can't login through User account ");
    //   yield put({ type: "TOGGLE_LOGIN" });
    //   return;
    // }
    yield put(saveloginData(response['data']['body']));
    yield put({ type: "SET_USER_DETAILS", payload: response['data']['body']['user'] });
    EventBus.publish("success", response['data']['message'])
    console.log('***** sagaaaa success message')
    setTimeout(() => history.push('/home'), 10000);
    console.log('***** already pushed')

  }
  yield put({ type: "TOGGLE_LOGIN" });}

/*========== DASHBOARD FUNCTIONS =============*/

function* getDashboardStats() {
  const { error, response } = yield call(getCall, '/user/stats');
  if (error) EventBus.publish("error", error['response']['data']['message']);
  else if (response) yield put({ type: "SET_DASHBOARD_STATS", payload: response['data']['body'] });
};

function* getMe() {
  const { error, response } = yield call(getCall, '/user/myProfile');
  if (!error && response) {
    yield put({ type: "SET_USER_DETAILS", payload: response['data']['body'] });
  };
}

function* resetPassword({ payload }) {
  const { formData, successCallback, failCallback } = payload;
  const { error, response } = yield call(postCall, { path: '/user/setPassword', payload: formData });
  if (error) {
    failCallback()
    EventBus.publish("error", error['response']['data']['message']);
  }
  else if (response) {
    EventBus.publish("success", response['data']['message'])
    successCallback();
  }
};

function* forgotPassword({ payload }) {
  const { formData, successCallback, failCallback } = payload;
  const { error, response } = yield call(postCall, { path: '/user/forgotPassword', payload: formData });
  if (error) {
    failCallback()
    EventBus.publish("error", error['response']['data']['message']);
  } else if (response) successCallback();
};
function* changePassword({ payload }) {
  const { formData, successCallback, failCallback } = payload;
  const { error, response } = yield call(postCall, { path: '/user/changePassword', payload: formData });
  if (error) {
    failCallback()
    EventBus.publish("error", error['response']['data']['message']);
  } else if (response) successCallback();
};






function* actionWatcher() {
  yield takeEvery('LOGIN', login);
  yield takeEvery('SIGN_UP', signup);


  yield takeEvery('GET_ME', getMe);
  yield takeEvery('RESET_PASSWORD', resetPassword);
  yield takeEvery('CHANGE_PASSWORD', changePassword);
  yield takeEvery('FORGOT_PASSWORD', forgotPassword);
  yield takeEvery('GET_DASHBOARD_STATS', getDashboardStats);

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
