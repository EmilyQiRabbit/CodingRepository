/**
 * render document
 */
import { render } from 'react-dom'
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {Router, useRouterHistory} from 'react-router';
import {Route, IndexRoute} from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
const basename = require('../../Config').context;

class SharePage extends Component {
  render() {
    return(
      <span>Hello，Banana！</span>
    )
  }
}

const routes = (
  <Route path='sharePage' component={SharePage} ></Route>
)

const browserHistory = useRouterHistory(createBrowserHistory)({
  basename: basename ? basename : '/'
});

render(
  <div>
    <Router history={browserHistory}>
      {routes}
    </Router>
  </div>,
  document.getElementById('main')
);