import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import './app/layout/styles.css'
import App from './app/layout/App'
import ScrollToTop from './app/layout/ScrollToTop'
import * as serviceWorker from './serviceWorker'
import { createBrowserHistory } from 'history'
import 'react-toastify/dist/ReactToastify.css'

export const history = createBrowserHistory()

ReactDOM.render(
  <Router history={history}>
    <ScrollToTop />
    <App />
  </Router>,
  document.getElementById('root')
)
serviceWorker.unregister()
