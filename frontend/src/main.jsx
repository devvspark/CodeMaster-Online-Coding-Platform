import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router";
import {store} from "./store/store.js"
import { Provider } from 'react-redux';
import { ThemeProvider } from './components/ThemeContext.jsx';

// Create the root of the React app and render the component tree
createRoot(document.getElementById('root')).render(
  <StrictMode>   {/* Enables additional checks and warnings for React components during development */}
    <Provider store={store}> {/* Makes the Redux store available to the entire app */}
      <BrowserRouter> {/* Enables client-side routing using React Router */}
          <App /> {/* Main application component containing routes and UI */}
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
