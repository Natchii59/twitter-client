import { useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

import { selectUser } from '../stores/authSlice'
import ComposeTweetModal from './ComposeTweetModal'

function Sidebar() {
  const user = useSelector(selectUser)

  const [isComposeTweetModalOpen, setIsComposeTweetModalOpen] =
    useState<boolean>(false)

  const handleComposeTweetModal = () => {
    setIsComposeTweetModalOpen(true)
  }

  return (
    <nav className='flex flex-col xl:items-start items-center gap-3 mt-2'>
      <NavLink
        to='/'
        className='flex items-center justify-center xl:justify-start gap-4 px-3 py-2 rounded-full text-zinc-200 hover:bg-gray-50/10 transition-colors'
        style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}
      >
        <svg fill='currentColor' viewBox='0 0 24 24' className='h-7 w-7'>
          <g>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z'
            ></path>
          </g>
        </svg>

        <span className='hidden xl:block text-xl'>Accueil</span>
      </NavLink>

      <NavLink
        to='/explore'
        className='flex items-center justify-center xl:justify-start gap-4 px-3 py-2 rounded-full text-zinc-200 hover:bg-gray-50/10 transition-colors'
        style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}
      >
        <svg fill='currentColor' viewBox='0 0 24 24' className='h-7 w-7'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M21 7.337h-3.93l.372-4.272c.036-.412-.27-.775-.682-.812-.417-.03-.776.27-.812.683l-.383 4.4h-6.32l.37-4.27c.037-.413-.27-.776-.68-.813-.42-.03-.777.27-.813.683l-.382 4.4H3.782c-.414 0-.75.337-.75.75s.336.75.75.75H7.61l-.55 6.327H3c-.414 0-.75.336-.75.75s.336.75.75.75h3.93l-.372 4.272c-.036.412.27.775.682.812l.066.003c.385 0 .712-.295.746-.686l.383-4.4h6.32l-.37 4.27c-.036.413.27.776.682.813l.066.003c.385 0 .712-.295.746-.686l.382-4.4h3.957c.413 0 .75-.337.75-.75s-.337-.75-.75-.75H16.39l.55-6.327H21c.414 0 .75-.336.75-.75s-.336-.75-.75-.75zm-6.115 7.826h-6.32l.55-6.326h6.32l-.55 6.326z'
          ></path>
        </svg>

        <span className='hidden xl:block text-xl'>Explorer</span>
      </NavLink>

      <NavLink
        to={`/profile/${user?.username}`}
        className='flex items-center justify-center xl:justify-start gap-4 px-3 py-2 rounded-full text-zinc-200 hover:bg-gray-50/10 transition-colors'
        style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}
      >
        <svg fill='currentColor' viewBox='0 0 24 24' className='h-7 w-7'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M12 11.816c1.355 0 2.872-.15 3.84-1.256.814-.93 1.078-2.368.806-4.392-.38-2.825-2.117-4.512-4.646-4.512S7.734 3.343 7.354 6.17c-.272 2.022-.008 3.46.806 4.39.968 1.107 2.485 1.256 3.84 1.256zM8.84 6.368c.162-1.2.787-3.212 3.16-3.212s2.998 2.013 3.16 3.212c.207 1.55.057 2.627-.45 3.205-.455.52-1.266.743-2.71.743s-2.255-.223-2.71-.743c-.507-.578-.657-1.656-.45-3.205zm11.44 12.868c-.877-3.526-4.282-5.99-8.28-5.99s-7.403 2.464-8.28 5.99c-.172.692-.028 1.4.395 1.94.408.52 1.04.82 1.733.82h12.304c.693 0 1.325-.3 1.733-.82.424-.54.567-1.247.394-1.94zm-1.576 1.016c-.126.16-.316.246-.552.246H5.848c-.235 0-.426-.085-.552-.246-.137-.174-.18-.412-.12-.654.71-2.855 3.517-4.85 6.824-4.85s6.114 1.994 6.824 4.85c.06.242.017.48-.12.654z'
          ></path>
        </svg>

        <span className='hidden xl:block text-xl'>Profil</span>
      </NavLink>

      <NavLink
        style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}
        to='/more'
        className='flex items-center justify-center xl:justify-start gap-4 px-3 py-2 rounded-full text-zinc-200 hover:bg-gray-50/10 transition-colors'
      >
        <svg fill='currentColor' viewBox='0 0 24 24' className='h-7 w-7'>
          <g>
            <path d='M16.5 10.25c-.965 0-1.75.787-1.75 1.75s.784 1.75 1.75 1.75c.964 0 1.75-.786 1.75-1.75s-.786-1.75-1.75-1.75zm0 2.5c-.414 0-.75-.336-.75-.75 0-.413.337-.75.75-.75s.75.336.75.75c0 .413-.336.75-.75.75zm-4.5-2.5c-.966 0-1.75.787-1.75 1.75s.785 1.75 1.75 1.75 1.75-.786 1.75-1.75-.784-1.75-1.75-1.75zm0 2.5c-.414 0-.75-.336-.75-.75 0-.413.337-.75.75-.75s.75.336.75.75c0 .413-.336.75-.75.75zm-4.5-2.5c-.965 0-1.75.787-1.75 1.75s.785 1.75 1.75 1.75c.964 0 1.75-.786 1.75-1.75s-.787-1.75-1.75-1.75zm0 2.5c-.414 0-.75-.336-.75-.75 0-.413.337-.75.75-.75s.75.336.75.75c0 .413-.336.75-.75.75z'></path>
            <path d='M12 22.75C6.072 22.75 1.25 17.928 1.25 12S6.072 1.25 12 1.25 22.75 6.072 22.75 12 17.928 22.75 12 22.75zm0-20C6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25s9.25-4.15 9.25-9.25S17.1 2.75 12 2.75z'></path>
          </g>
        </svg>

        <span className='hidden xl:block text-xl'>Plus</span>
      </NavLink>

      <button
        onClick={handleComposeTweetModal}
        className='mx-auto w-11 h-11 xl:w-full flex items-center justify-center bg-blue hover:bg-blue/90 p-4 rounded-full text-white font-bold transition-colors mb-10'
      >
        <div className='flex'>
          <svg
            fill='currentColor'
            viewBox='0 0 24 24'
            className='block xl:hidden h-6 w-6'
          >
            <g>
              <path d='M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z'></path>
            </g>
          </svg>
        </div>

        <span className='hidden xl:block font-bold text-md'>Tweeter</span>

        <ComposeTweetModal
          isOpen={isComposeTweetModalOpen}
          setIsOpen={setIsComposeTweetModalOpen}
        />
      </button>
    </nav>
  )
}

export default Sidebar
