// import io from 'socket.io-client';

/* -- set app title --*/
const AppTitle = 'DASHBOARD REMOTE JOB LAB';

/* -- set app mode -- */
const AppMode = [''];
// const AppMode = ['development'];
/* -- set API URLs --*/
let testing = 'http://localhost:4000';
let production = 'http://localhost:4000';
let development = 'http://localhost:4000';
if (process.env.REACT_APP_LOCAL_URL) development = 'http://localhost:4000'

let SocketUrl;
switch (AppMode[0]) {
  case 'development':
    SocketUrl = development;
    break;
  case 'production':
    SocketUrl = production;
    break;
  case 'testing':
    SocketUrl = testing;
    break;
  default:
    SocketUrl = 'http://localhost:4000';
};

// let socket = io(SocketUrl);
let ApiUrl = `${SocketUrl}/api`;
export { AppTitle, ApiUrl, SocketUrl };
// export { AppTitle, ApiUrl, SocketUrl, socket };