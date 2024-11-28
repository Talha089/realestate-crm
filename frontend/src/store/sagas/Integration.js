import axios from 'axios';
import EventBus from 'eventing-bus';
import { all, takeEvery, call, put } from 'redux-saga/effects';

import { setLists, setCampaigns, setTwilioToken, setCallingTask, setLeads } from '../actions/Integration';

/* Hubspot */
function* getLists() {
    yield put({ type: 'SET_LOADING', payload: true });
    const { error, response } = yield call(getCall, '/hubspot/lists');
    if (error) EventBus.publish("error", error['response']['data']['message']);
    else if (response) yield put(setLists(response['data']['body']));
    yield put({ type: 'SET_LOADING', payload: false });
};
function* createLists() {
    yield put({ type: 'SET_LOADING', payload: true });
    const { error, response } = yield call(getCall, '/hubspot/list/today');
    if (error) EventBus.publish("error", error['response']['data']['message']);
    else if (response) {
        yield put({ type: 'GET_LISTS' });
        EventBus.publish("success", response['data']['message']);
    }
    yield put({ type: 'SET_LOADING', payload: false });
};
function* deleteList({ payload }) {
    yield put({ type: 'SET_LOADING', payload: true });
    const { error, response } = yield call(getCall, `/hubspot/list/delete/${payload}`);
    if (error) EventBus.publish("error", error['response']['data']['message']);
    else if (response) {
        yield put({ type: 'GET_LISTS' });
        EventBus.publish("success", response['data']['message']);
    }
    yield put({ type: 'SET_LOADING', payload: false });
};
function* hubspotTaskDone({ payload }) {
    yield put({ type: 'SET_LOADING', payload: true });
    const { error, response } = yield call(getCall, `/hubspot/list/done/${payload}`);
    if (error) EventBus.publish("error", error['response']['data']['message']);
    else if (response) {
        yield put({ type: 'GET_LISTS' });
        EventBus.publish("success", response['data']['message']);
    }
    yield put({ type: 'SET_LOADING', payload: false });
};
function* completeList({ payload }) {
    yield put({ type: 'SET_LOADING', payload: true });
    const { error, response } = yield call(getCall, `/hubspot/list/completed/${payload}`);
    if (error) EventBus.publish("error", error['response']['data']['message']);
    else if (response) {
        yield put({ type: 'GET_LISTS' });
        EventBus.publish("success", response['data']['message']);
    }
    yield put({ type: 'SET_LOADING', payload: false });
};

/* Instantly */
function* getCampaigns() {
    yield put({ type: 'SET_LOADING', payload: true });
    const { error, response } = yield call(getCall, '/hubspot/instantly/campaigns');
    if (error) EventBus.publish("error", error['response']['data']['message']);
    else if (response) yield put(setCampaigns(response['data']['body']));
    yield put({ type: 'SET_LOADING', payload: false });
};
function* syncInstantlyLeads({ payload }) {
    yield put({ type: 'SET_LOADING', payload: true });
    const { error, response } = yield call(postCall, { path: '/hubspot/instantly/syncLeads', payload });
    if (error) EventBus.publish("error", error['response']['data']['message']);
    else if (response) {
        yield put({ type: 'GET_LISTS' });
        EventBus.publish("success", response['data']['message']);
    }
    yield put({ type: 'SET_LOADING', payload: false });
};

/* Twilio */
function* getTwilioToken() {
    const { error, response } = yield call(getCall, '/hubspot/twilio/token');
    if (error) EventBus.publish("error", error['response']['data']['message']);
    else if (response) yield put(setTwilioToken(response['data']['body']));
};
function* getCallingTask() {
    yield put({ type: 'SET_LOADING', payload: true });
    const { error, response } = yield call(getCall, '/hubspot/call/task');
    if (error) EventBus.publish("error", error['response']['data']['message']);
    else if (response) yield put(setCallingTask(response['data']['body']));
    yield put({ type: 'SET_LOADING', payload: false });
};
function* setCallDone({ payload }) {
    yield put({ type: 'SET_LOADING', payload: true });
    const { error, response } = yield call(postCall, { path: `/hubspot/call/task`, payload });
    if (error) EventBus.publish("error", error['response']['data']['message']);
    else if (response) EventBus.publish("success", response['data']['message']);
    yield put({ type: 'SET_LOADING', payload: false });
};
function* callTaskCompleted({ payload }) {
    yield put({ type: 'SET_LOADING', payload: true });
    const { error, response } = yield call(getCall, `/hubspot/call/completed/${payload}`);
    if (error) EventBus.publish("error", error['response']['data']['message']);
    else if (response) yield put(setCallingTask(response['data']['body']));
    yield put({ type: 'SET_LOADING', payload: false });
};


/* Leads */
function* createLeads({ payload }) {
    console.log('*******createLeads payload', payload)
    yield put({ type: 'SET_LOADING', payload: true });
    const { error, response } = yield call(postCall, { path: '/leads/leads', payload });
    if (error) EventBus.publish("error", error['response']['data']['message']);
    else if (response) {
        yield put({ type: 'GET_LEADS' });
        EventBus.publish("success", response['data']['message']);
    }
    yield put({ type: 'SET_LOADING', payload: false });
}

function* getLeads() {
    yield put({ type: 'SET_LOADING', payload: true });
    const { error, response } = yield call(getCall, '/leads/leads');
    if (error) EventBus.publish("error", error['response']['data']['message']);
    else if (response) yield put(setLeads(response['data']['body']));
    yield put({ type: 'SET_LOADING', payload: false });
};



function* actionWatcher() {
    yield takeEvery('GET_LISTS', getLists);
    yield takeEvery('DELETE_LIST', deleteList);
    yield takeEvery('CREATE_LISTS', createLists);
    yield takeEvery('COMPLETE_LIST', completeList);
    yield takeEvery('GET_TWILIO_TOKEN', getTwilioToken);

    yield takeEvery('SET_CALL_DONE', setCallDone);
    yield takeEvery('GET_CALLING_TASK', getCallingTask);
    yield takeEvery('HUBSPOT_TASK_DONE', hubspotTaskDone);
    yield takeEvery('CALL_TASK_COMPLETED', callTaskCompleted);

    yield takeEvery('GET_CAMPAIGNS', getCampaigns);
    yield takeEvery('SYNC_INSTANTLY_LEADS', syncInstantlyLeads);


    yield takeEvery('CREATE_LEAD', createLeads);
    yield takeEvery('GET_LEADS', getLeads);


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