import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/sonner"

import { store } from "./store";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
       <Toaster position='top-center'/>
    </Provider>
  </StrictMode>,
)
