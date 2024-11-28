import { all } from 'redux-saga/effects';
import authSagas from './Auth.js';
import leadsSagas from './Leads.js';


export default function* rootSaga() {
  yield all([
    authSagas(),
    leadsSagas(),
  ]);
}