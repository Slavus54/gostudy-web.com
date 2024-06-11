import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client'
import {createHttpLink} from 'apollo-link-http'
import {Provider} from 'react-redux'
import AppProvider from './context/AppContext'
import {store} from './store/store'
import {WEBSERVER_URL, APP_NODE} from './env/env'

//@ts-ignore

const link = new createHttpLink({
  uri: WEBSERVER_URL
})

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

const root = ReactDOM.createRoot(
  document.getElementById(APP_NODE) as HTMLElement
)

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AppProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </AppProvider>
    </ApolloProvider>
  </React.StrictMode>
)

reportWebVitals()

if ('serviceWorker' in navigator && window.location.pathname === '/') {
  window.navigator.serviceWorker.register('./sw/serviceWorker.js')
}