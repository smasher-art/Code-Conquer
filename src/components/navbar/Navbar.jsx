import React from 'react'

import { navlinks } from '@u/constants/navbar'
import { NavLink } from 'react-router-dom'
import usePlayer from '@/hooks/usePlayer'



export default function Navbar() {
  const { player, level, xp } = usePlayer()

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

      {/* HUD */}
      <div className='flex items-center gap-4'>
        <div className='flex flex-col items-end leading-tight'>
          <div className='text-xs text-black/60'>Level {level}</div>
          <div className='text-xs text-black/60'>{player.xpUnspent} XP</div>
        </div>
        <div className='w-44'>
          <div className='h-2 rounded bg-black/10 overflow-hidden'>
            <div className='h-full bg-black' style={{ width: `${xp.pct}%` }} />
          </div>
          <div className='text-[10px] text-black/50 mt-1 text-right'>
            {xp.intoLevel}/{xp.span}
          </div>
        </div>

      <button
      >
        Login
      </button>

      </div>

    </div>
  )
}
