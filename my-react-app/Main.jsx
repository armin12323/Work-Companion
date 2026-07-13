import { createRoot } from 'react-dom/client'
import './src/styles/main-styles.css'
import { MainNotesView } from "./src/components/main-notes-view"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { Show, SignInButton, SignUpButton, UserButton, ClerkProvider } from '@clerk/react'
import { StrictMode } from 'react'
import App from './src/App'
// import "bootstrap/dist/css/bootstrap.min.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key OOOOO - ARMIN')
}

createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>

)
