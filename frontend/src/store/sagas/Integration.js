import axios from 'axios';
import EventBus from 'eventing-bus';
import { all, takeEvery, call, put } from 'redux-saga/effects';

import { setLeads } from '../actions/Integration';


/* Leads */
function* createLeads({ payload }) {
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

function* setLead({ payload }) {
    yield put({ type: 'SET_LOADING', payload: true });
    const { error, response } = yield call(putCall, { path: `/leads/leads/${payload['_id']}`, payload });
    if (error) EventBus.publish("error", error['response']['data']['message']);
    else if (response) {
        yield put({ type: 'GET_LEADS' });
        EventBus.publish("success", response['data']['message']);
    }
    yield put({ type: 'SET_LOADING', payload: false });
};


function* removeLead({ payload }) {
    yield put({ type: 'SET_LOADING', payload: true });
    console.log(`******** payload`, payload);
    const { error, response } = yield call(deleteCall, `/leads/leads/${payload['_id']}`);
    if (error) EventBus.publish("error", error['response']['data']['message']);
    else if (response) {
        yield put({ type: 'GET_LEADS' });
        EventBus.publish("success", response['data']['message']);
    }
    yield put({ type: 'SET_LOADING', payload: false });
}

function* actionWatcher() {

    yield takeEvery('CREATE_LEAD', createLeads);
    yield takeEvery('GET_LEADS', getLeads);
    yield takeEvery('SET_LEAD', setLead);
    yield takeEvery('DELETE_LEAD', removeLead);

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