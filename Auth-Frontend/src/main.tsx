import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login, AuthLayout, Register, ForgotPassword, VerifyOtp, } from './pages/Auth/index'
import Home from './pages/Home.tsx'
import Layout from './Layout.tsx'
import PageNotFound from './pages/PageNotFound.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout/>} >
          <Route path='/' element={<Home />} />
        </Route>
        <Route element={<AuthLayout />} >   {/* private wrapper to protect the routes */}
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/forgotpassword' element={<ForgotPassword/>} />
            <Route path='/verifyotp' element={<VerifyOtp/>} />
          </Route>
          <Route path='*' element={<PageNotFound/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
