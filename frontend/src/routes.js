import Users from "./views/Users/index.js";
import Logout from "./views/Logout/index.js";
import Dashboard from "./views/Dashboard/index.js";
import Leads from "./views/Leads/index.js";

let routes = [{
  path: "/",
  layout: "/home",
  component: Dashboard,
  hidden: true,
}, {
  layout: "/home",
  path: "/dashboard",
  name: "Dashboard",
  component: Dashboard,
  icon: "tim-icons icon-chart-pie-36",
},   {
  layout: "/home",
  path: "/integrations",
  name: "Leads",
  component: Leads,
  icon: "tim-icons icon-puzzle-10",
},  {
  layout: "/home",
  path: "/logout",
  name: "Logout",
  component: Logout,
  icon: "tim-icons icon-button-power",
}];

export default routes;
