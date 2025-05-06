import { useState } from 'react'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import { ToastContainer } from 'react-toastify'

function App() {

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="rounded-lg shadow-lg px-4 py-3"
        bodyClassName="text-sm"
      />
      <AppRoutes />
    </>
  )
}

export default App
