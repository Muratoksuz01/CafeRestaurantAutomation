import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/sonner"

import { store, persistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>
        <App />
        <Toaster position='top-center' />
      </Provider>
    </PersistGate>
  </StrictMode>,
)
