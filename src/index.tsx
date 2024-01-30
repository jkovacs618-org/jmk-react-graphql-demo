import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.tsx'
import reportWebVitals from '@/plugins/reportWebVitals.js'
import '@/styles/index.css'

// Include React.StrictMode wrapper for dev testing of components render/effects.
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)

reportWebVitals(console.log)
