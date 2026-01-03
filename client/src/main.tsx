import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import { ApiProvider } from '@reduxjs/toolkit/query/react'
import { apiSlice } from './api/apiSlice.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <ApiProvider api={apiSlice} >
        <Provider store={store} >
          <App />
        </Provider>
      </ApiProvider>
    </Router>
  </StrictMode>,
)
