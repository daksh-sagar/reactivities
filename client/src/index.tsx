import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import App from './app/layout/App'
import ScrollToTop from './app/layout/ScrollToTop'
import * as serviceWorker from './serviceWorker'
import { createBrowserHistory } from 'history'
import dateFnsLocalizer from 'react-widgets-date-fns'
import 'react-toastify/dist/ReactToastify.css'
import './app/layout/styles.css'
import 'react-widgets/dist/css/react-widgets.css'

dateFnsLocalizer()

export const history = createBrowserHistory()

ReactDOM.render(
  <Router history={history}>
    <ScrollToTop />
    <App />
  </Router>,
  document.getElementById('root')
)
serviceWorker.unregister()
