import axios from 'axios';
import jwt_decode from 'jwt-decode';
import EventBus from 'eventing-bus';
import { all, takeEvery, call, put } from 'redux-saga/effects';

import { saveloginData } from '../actions/Auth';

/*========== LOGIN FUNCTIONS =============*/

function* login({ payload, history }) {
  const { error, response } = yield call(postCall, { path: '/user/signin', payload });
  if (error) EventBus.publish("error", error['response']['data']['message']);
  else if (response) {
    yield put(saveloginData(response['data']['body']));
    yield put({ type: "SET_USER_DETAILS", payload: response['data']['body']['user'] });
    EventBus.publish("success", response['data']['message'])
    setTimeout(() => history.push('/home'), 1000);
  }
  yield put({ type: "TOGGLE_LOGIN" });
};


function* signup({ payload, history }) {

  const { error, response } = yield call(postCall, { path: '/user/signup', payload });
  if (error) {
    EventBus.publish("error", error['response']['data']['message']);
  }
  else if (response) {
    yield put(saveloginData(response['data']['body']));
    yield put({ type: "SET_USER_DETAILS", payload: response['data']['body']['user'] });
    EventBus.publish("success", response['data']['message'])
    setTimeout(() => history.push('/home'), 1000);

  }
  yield put({ type: "TOGGLE_LOGIN" });
}

/*========== DASHBOARD FUNCTIONS =============*/

function* getDashboardStats() {
  const { error, response } = yield call(getCall, '/leads/stats');
  if (error) EventBus.publish("error", error['response']['data']['message']);
  else if (response) yield put({ type: "SET_DASHBOARD_STATS", payload: response['data']['body'] });
};



function* actionWatcher() {
  yield takeEvery('LOGIN', login);
  yield takeEvery('SIGN_UP', signup);
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
