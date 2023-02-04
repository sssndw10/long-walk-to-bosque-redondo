import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider } from 'styled-components'

const theme = {
  black : {
    lighter:'#333333',
    darker:'#1a1a1a',
    real:'#000000',
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App/>
    </ThemeProvider>
  </React.StrictMode>,
)
