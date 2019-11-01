import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import './app/layout/styles.css'
import App from './app/layout/App'
import ScrollToTop from './app/layout/ScrollToTop'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <BrowserRouter>
    <ScrollToTop />
    <App />
  </BrowserRouter>,
  document.getElementById('root')
)
serviceWorker.unregister()
