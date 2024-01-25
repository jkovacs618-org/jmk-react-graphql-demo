import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import reportWebVitals from './plugins/reportWebVitals.js'
import './plugins/fontawesome'
import './styles/index.css'

// Removed React.StrictMode wrapper to avoid components rendering twice on dev.
ReactDOM.createRoot(document.getElementById('root')!).render(<App />)

reportWebVitals(console.log)
