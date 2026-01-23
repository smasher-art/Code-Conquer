import React from 'react'
import {Route, Routes} from "react-router-dom"


import Home from '@p/Home'
import Learn from '@p/Learn'
import Navbar from '@c/navbar/Navbar'
import ScrollToTop from '@c/ScrollToTop'



function App() {
  return (
    <div className="min-h-dvh w-full bg-white relative font-JetBrains">
      {/* Background */}
      <div
        className="fixed inset-0"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
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
        </Routes>


      </div>


    </div>
  )
}

export default App
