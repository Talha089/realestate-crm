import { all } from 'redux-saga/effects';
import authSagas from './Auth.js';
import userSagas from './User.js';
import jobSagas from './Job.js';
import accountSagas from './Account.js';
import campaignSagas from './Campaign.js';
import integrationSagas from './Integration.js';


export default function* rootSaga() {
  yield all([
    authSagas(),
    userSagas(),
    jobSagas(),
    accountSagas(),
    campaignSagas(),
    integrationSagas(),
  ]);
}