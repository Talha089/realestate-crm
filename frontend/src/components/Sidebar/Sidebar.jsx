import React from 'react';
import { Nav } from 'reactstrap';
import { PropTypes } from 'prop-types';
import { Sidebar} from 'react-pro-sidebar';
import { NavLink } from 'react-router-dom';
import PerfectScrollbar from 'perfect-scrollbar';

let ps;
class SidebarMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { collapsed: true }
    this.activeRoute.bind(this);
  }
  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1)
      ps = new PerfectScrollbar(this.refs.sidebar, {
        suppressScrollX: true,
        suppressScrollY: false
      });
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) ps.destroy();
  }
  linkOnClick = () => document.documentElement.classList.remove("nav-open");

  render() {
    const { bgColor, routes, rtlActive, logo } = this.props;

    return (
        <div className="sidebar" data={bgColor}>
          <div className="sidebar-wrapper" ref="sidebar">
            <div className="logo logo-full-sidebar text-left text-dark" >
              <a href={logo.outterLink} target="_blank">
                <img alt="..." src={require('../../assets/img/logo.png')} />
              </a>
            </div>
            <div className="logo logo-compress-sidebar text-left text-dark" >
              <a href={logo.outterLink} target="_blank">
                <img alt="..." src={require('../../assets/img/icon.png')} />
              </a>
            </div>
            <Nav>
              {routes.map((prop, key) => {
                if (prop.redirect) return null;
                return (
                  <React.Fragment>
                    {!prop['hidden'] &&
                      <li
                        className={
                          this.activeRoute(prop.path) +
                          (prop.pro ? " active-pro" : "")
                        }
                        key={key}
                      >
                        <NavLink
                          to={prop.layout + prop.path}
                          className="nav-link"
                          activeClassName="active"
                        // onClick={() => this.props.toggleSidebar(prop.name)}
                        >
                          <i className={prop.icon + ' text-dark'} />
                          <p className="text-dark font-weight-bold">{rtlActive ? prop.rtlName : prop.name}</p>
                        </NavLink>
                      </li>}
                  </React.Fragment>
                );
              })}
            </Nav>
          </div>
        </div>
    );
  }
}

Sidebar.defaultProps = {
  rtlActive: false,
  bgColor: "primary",
  routes: [{}]
};

Sidebar.propTypes = {
  // if true, then instead of the routes[i].name, routes[i].rtlName will be rendered
  // insde the links of this component
  rtlActive: PropTypes.bool,
  bgColor: PropTypes.oneOf(["primary", "blue", "green"]),
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the text of the logo
    text: PropTypes.node,
    // the image src of the logo
    imgSrc: PropTypes.string
  })
};

export default SidebarMenu;
