import axios from 'axios';
import EventBus from 'eventing-bus';
import { all, takeEvery, call, put } from 'redux-saga/effects';
import { setAllCampaign, setSingleTask, setCampaignLogs } from '../actions/Campaign';

function* getAllCampaign() {
  const { error, response } = yield call(getCall, '/campaign');
  if (error) EventBus.publish("error", error['response']['data']['message']);
  else if (response) yield put(setAllCampaign(response['data']['body']));
};

function* getSingleTask({ payload }) {
  const { error, response } = yield call(getCall, `/campaign/${payload}`);
  if (error) EventBus.publish("error", error['response']['data']['message']);
  else if (response) yield put(setSingleTask(response['data']['body']));
};

function* createTask({ payload }) {
  const { successCallback, failCallback, formData } = payload;
  const { error, response } = yield call(postCall, { path: `/campaign`, payload: formData });
  if (error) {
    failCallback();
    EventBus.publish("error", error['response']['data']['message']) || error['message'] || 'Something went Wrong'
  } else if (response) {
    successCallback();
    EventBus.publish("success", response['data']['message']);
    yield put({ type: 'ADD_CAMPAIGN', payload: response.data.body });
  }
};

function* updateTask({ payload }) {
  const { successCallback, failCallback, formData, id } = payload;
  const { error, response } = yield call(patchCall, { path: `/campaign/${id}`, payload: formData });
  if (error) {
    failCallback();
    EventBus.publish("error", error['response']['data']['message']);
  } else if (response) {
    console.log("response.data", response.data)
    successCallback();
    EventBus.publish("success", response['data']['message']);
    yield put({ type: 'UPDATE_CAMPAIGN_STATE', payload: response.data.body });
  }
};

function* updateStatus({ payload }) {
  const { error, response } = yield call(patchCall, { path: `/campaign/status/${payload['id']}`, payload });
  if (error) EventBus.publish("error", error['response']['data']['message']);
  else if (response) {
    EventBus.publish("success", response['data']['message']);
    yield put({ type: 'GET_ALL_CAMPAIGNS' });
  }
};

function* editTask({ payload, id }) {
  const { error, response } = yield call(putCall, { path: `/updateTask/${id}`, payload });
  if (error) EventBus.publish("error", error['response']['data']['message']);
  else if (response) {
    EventBus.publish("success", response['data']['message']);
    yield put({ type: 'GET_SINGLE_CAMPAIGN', payload: id });
  }
};

function* getCampaignLogs({ payload }) {
  const { error, response } = yield call(getCall, `/campaign/campaignLogs/${payload}`);
  if (error) EventBus.publish("error", error['response']['data']['message']);
  else if (response) yield put(setCampaignLogs(response['data']['body']));
};

function* deleteSingleCampaign({ payload }) {
  const { error, response } = yield call(deleteCall, `/campaign/${payload}`);
  if (error) EventBus.publish("error", error['response']['data']['message']);
  else if (response) {
    EventBus.publish("success", response['data']['message']);
    yield put({ type: 'GET_ALL_CAMPAIGNS' });
  }
};


function* actionWatcher() {
  yield takeEvery('EDIT_CAMPAIGN', editTask);
  yield takeEvery('UPDATE_CAMPAIGN', updateTask);
  yield takeEvery('UPDATE_STATUS', updateStatus);
  yield takeEvery('CREATE_CAMPAIGN', createTask);
  yield takeEvery('GET_ALL_CAMPAIGNS', getAllCampaign);
  yield takeEvery('GET_SINGLE_CAMPAIGN', getSingleTask);
  yield takeEvery('GET_CAMPAIGN_LOGS', getCampaignLogs);
  yield takeEvery('DELETE_SINGLE_CAMPAIGN', deleteSingleCampaign);
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
