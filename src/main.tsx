import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// Note: StrictMode is intentionally off — its dev-only double-mount spawns
// two racing react-joyride instances and breaks the Guided Showcase tour.
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
