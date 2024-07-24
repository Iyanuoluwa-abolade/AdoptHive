import React from 'react'
import ReactDOM from 'react-dom/client'
import WrappedApp from './App/App.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WrappedApp />
  </React.StrictMode>,
  document.getElementById('root')
)
