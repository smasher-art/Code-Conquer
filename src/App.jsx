import React from 'react'
import {Route, Routes} from "react-router-dom"


import Home from '@p/Home'
import Learn from '@p/Learn'
import LearnPath from '@p/LearnPath'
import Lesson from '@p/Lesson'
import Profile from '@p/Profile'
import Login from '@p/Login'
import Signup from '@p/Signup'
import Shrine from '@p/Shrine'
import Navbar from '@c/navbar/Navbar'
import ScrollToTop from '@c/ScrollToTop'



function App() {
  return (
    <div className="min-h-dvh w-full bg-zinc-950 text-zinc-100 relative font-JetBrains">
      {/* Background */}
      <div
        className="fixed inset-0"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.06) 49%, rgba(255,255,255,0.06) 51%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, rgba(255,255,255,0.06) 49%, rgba(255,255,255,0.06) 51%, transparent 51%)
          `,
          backgroundSize: "45px 45px",
          WebkitMaskImage:
                "radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)",
              maskImage:
                "radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)",
        }}
      />
      {/* Body */}
      <div
      className='min-h-dvh relative z-10
      flex flex-col'>
        <Navbar/>
        <ScrollToTop/>

        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/learn' element={<Learn/>} />
          <Route path='/learn/:lang' element={<LearnPath/>} />
          <Route path='/learn/:lang/:skill' element={<Lesson/>} />
          <Route path='/profile' element={<Profile/>} />
          <Route path='/shrine' element={<Shrine/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<Signup/>} />
        </Routes>


      </div>


    </div>
  )
}

export default App
