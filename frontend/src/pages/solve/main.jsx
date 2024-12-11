import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SDiagnosisPage from './SDiagnosisPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SDiagnosisPage />
  </StrictMode>,
)
