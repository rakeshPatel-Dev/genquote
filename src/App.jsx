import React from 'react'
import Home from './Home'
import Favorite from './Favorite'
import Header from './Header'
import Footer from './Footer'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <div className=' h-screen bg-[#f6f6f8] dark:bg-[#101622]'>
      <Toaster />
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/favorite' element={<Favorite />} />

      </Routes>
      <Footer />
    </div>
  )
}

export default App
