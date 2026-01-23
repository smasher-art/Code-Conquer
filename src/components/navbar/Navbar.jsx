import React from 'react'

import { navlinks } from '@u/constants/Navbar'
import { NavLink } from 'react-router-dom'



export default function Navbar() {
  return (
    <div
    className='h-20 p-4 flex items-center justify-between
    sticky top-0 bg-white/50 backdrop-blur-sm border-b border-black/10
    px-40 z-9999'>
      <h1
      className='text-2xl font-semibold'>
        Code Conquer
      </h1>

      <div
      className='flex gap-7 h-full text-xl
      items-center'>
        {
          navlinks.map( (item,index)=> (
            <NavLink
            key={index}
            to={item.to}
            className={({isActive})=> `duration-300 relative ${isActive ? "text-black pb-1 font-semibold":"text-black/70"}`}
            >
              {item.name}
            </NavLink>
          ) )
        }
      </div>

      <button
      >
        Login
      </button>

    </div>
  )
}
