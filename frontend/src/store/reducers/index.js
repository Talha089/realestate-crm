import Auth from "./Auth.js";
import User from "./User.js";
import Job from "./Job.js";
import Account from "./Account.js";
import Campaign from "./Campaign.js";
import Integration from "./Integration.js";
import { combineReducers } from "redux";

export default combineReducers({
  Auth, User, Job, Account, Campaign, Integration
});