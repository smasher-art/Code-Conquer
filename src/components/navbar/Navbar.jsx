import React from 'react'

import { navlinks } from '@u/constants/navbar'
import { NavLink } from 'react-router-dom'
import usePlayer from '@/hooks/usePlayer'
import { logout } from '@/services/auth'



export default function Navbar() {
  const { player, level, xp } = usePlayer()
  const hasToken = (() => {
    try { return !!localStorage.getItem('bebo_token') } catch { return false }
  })()

  return (
    <div
    className='h-20 p-4 flex items-center justify-between
    sticky top-0 bg-black/30 backdrop-blur-sm border-b border-white/10
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
            className={({isActive})=> `duration-300 relative ${isActive ? "text-white pb-1 font-semibold":"text-white/70"}`}
            >
              {item.name}
            </NavLink>
          ) )
        }
      </div>

      {/* HUD */}
      <div className='flex items-center gap-4'>
        <div className='flex flex-col items-end leading-tight'>
          <div className='text-xs text-white/70'>Level {level}</div>
          <div className='text-xs text-white/70'>{player.xpUnspent} XP</div>
        </div>
        <div className='w-44'>
          <div className='h-2 rounded bg-white/10 overflow-hidden'>
            <div className='h-full bg-white' style={{ width: `${xp.pct}%` }} />
          </div>
          <div className='text-[10px] text-white/50 mt-1 text-right'>
            {xp.intoLevel}/{xp.span}
          </div>
        </div>

      {hasToken ? (
        <button
          onClick={() => {
            logout()
            window.location.href = '/'
          }}
          className="px-3 py-2 text-sm rounded border border-white/10 hover:bg-white/5"
        >
          Logout
        </button>
      ) : (
        <NavLink
          to="/login"
          className="px-3 py-2 text-sm rounded border border-white/10 hover:bg-white/5"
        >
          Login
        </NavLink>
      )}

      </div>

    </div>
  )
}
