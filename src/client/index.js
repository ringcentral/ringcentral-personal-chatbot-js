import React from 'react'
import ReactDOM from 'react-dom'

import store from './store'
import App from './components/index.jsx'
import './css/style.styl'

ReactDOM.render(<App store={store} />, document.getElementById('container'))
