import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/UserContext.jsx';
import { DrProvider } from './context/DrContext.jsx';
import {SocketProvider} from './context/socketContext.jsx'

createRoot(document.getElementById('root')).render(
   <StrictMode>
    <SocketProvider>  {/* ✅ Wrap here */}
      <DrProvider>
        <UserProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </UserProvider>
      </DrProvider>
    </SocketProvider>
  </StrictMode>,
)
