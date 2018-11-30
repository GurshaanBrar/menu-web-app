// EXTERNAL
import React from "react"
import ReactDOM from "react-dom"
import App from "./App/App"
import CreateTab from "./App/Containers/CreateTab/CreateTab"
import Homepage from "./App/Containers/Homepage/Homepage"
import { Provider } from "mobx-react";
import { configure } from 'mobx';
import { Route, Switch, Router } from 'react-router-dom';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import AppStore from "./App/Stores/AppStore";
import registerServiceWorker from './registerServiceWorker';
import "./index.css"
import ConsoleHome from "./App/Containers/ConsoleHome/ConsoleHome";
import AnalyzeTab from "./App/Containers/AnalyzeTab/AnalyzeTab";
import SettingsTab from "./App/Containers/SettingsTab/SettingsTab";

// router constants
const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();

// mobx global config
configure({
    enforceActions: true // only @action functions can change store observablees
});

const stores = {
  // mobx router store
  routing: routingStore,
  // ...other stores
  globalStore: AppStore,
};

const history = syncHistoryWithStore(browserHistory, routingStore);
const app = document.getElementById("root");

// Login status message
// ReactDOM.render(
//   <div>Logging On</div>
//   , app
// )

// // log user on then renderApp
// RequestHandler.getUserInfo()
// // store user data in AppStore
// .then(inum => {
//   if (inum.data === null) {
//     throw "inumber is null"
//   }
//   else {
//     console.log(inum);
//     AppStore.user_inumber = inum.data[0];
//     AppStore.user_db_id = inum.data[1];
//   }
// })
// render app
// .then(inum => {
  ReactDOM.render(
      <Provider {...stores}>
        <Router history={history}>
          <div>
            <Route path='/console' component={App}></Route> {/* PERSISTENT CONTAINER - WILL ALWAYS RENDER */}
            <Route exact path="/" component={Homepage}></Route> {/* RENDERS FOR EXACT PATH */}
            {/* SWITCHES BASED ON ROUTE */}
            <Switch>
              {/* #~#~#~#~# CONTAINERS #~#~#~#~# */}
              {/*   Add all containers below */}
              <Route exact path='/console' component={ConsoleHome}></Route>
              <Route path='/console/create' component={CreateTab}></Route>
              <Route path='/console/analyze' component={AnalyzeTab}></Route>
              <Route path='/console/settings' component={SettingsTab}></Route>
            </Switch>
          </div>
        </Router>
      </Provider>
    , app);
  registerServiceWorker();
  // })
  // .catch(err => {
  //   console.log(err);
  //   ReactDOM.render(<div>SSO Failed</div>, app)
  // })
