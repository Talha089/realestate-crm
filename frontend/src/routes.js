import Users from "./views/Users/index.js";
import Logout from "./views/Logout/index.js";
import Dashboard from "./views/Dashboard/index.js";
import Integrations from "./views/Integrations/index.js";

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
  name: "Integrations",
  component: Integrations,
  icon: "tim-icons icon-puzzle-10",
},  {
  layout: "/home",
  path: "/logout",
  name: "Logout",
  component: Logout,
  icon: "tim-icons icon-button-power",
}];

export default routes;
