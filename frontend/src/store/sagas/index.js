import { all } from 'redux-saga/effects';
import authSagas from './Auth.js';
import integrationSagas from './Integration.js';


export default function* rootSaga() {
  yield all([
    authSagas(),
    integrationSagas(),
  ]);
}