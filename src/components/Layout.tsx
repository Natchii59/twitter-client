import { Link, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../stores/authSlice'
import Sidebar from './Sidebar'
import { useState } from 'react'

function Layout() {
  const user = useSelector(selectUser)

  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false)

  const handleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen)
  }

  return (
    <div className='container mx-auto h-screen'>
      <div className='flex flex-row justify-center'>
        {/* Left */}
        <div className='w-1/6 xs:w-85 xl:w-230 h-screen overflow-y-auto'>
          <div className='flex flex-col h-screen xl:pr-3 fixed overflow-y-auto w-1/6 xs:w-85 xl:w-230'>
            {/* Logo */}
            <Link
              to='/'
              className='flex my-3 xl:ml-3 justify-center xl:justify-start'
            >
              <svg
                viewBox='0 0 24 24'
                className='w-7 h-7 text-zinc-200'
                fill='currentColor'
              >
                <g>
                  <path d='M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z'></path>
                </g>
              </svg>
            </Link>
            {/* /Logo */}

            {/* Nav */}
            <Sidebar />
            {/* /Nav */}

            {/* UserMenu */}
            <div className='xl:w-full mx-auto mt-auto'>
              {userMenuOpen && (
                <button className='py-2 px-4 border border-zinc-500 rounded-md text-sm font-semibold'>
                  Se déconnecter de @{user?.username}
                </button>
              )}

              <button
                onClick={handleUserMenu}
                className='flex justify-between items-center rounded-full hover:bg-gray-50/10 p-3 cursor-pointer transition-colors mb-2'
              >
                <div className='flex'>
                  <img
                    className='w-10 h-10 rounded-full'
                    src='/default_pfp.jpeg'
                    alt='Profile'
                  />

                  <div className='hidden xl:flex flex-col items-start ml-2'>
                    <h1 className='text-zinc-100 font-bold text-sm'>
                      {user?.name}
                    </h1>
                    <p className='text-gray-400 text-sm'>@{user?.username}</p>
                  </div>
                </div>

                <div className='hidden xl:block'>
                  <div className='flex items-center h-full text-white'>
                    <svg
                      viewBox='0 0 24 24'
                      fill='currentColor'
                      className='h-4 w-4 mr-2'
                    >
                      <g>
                        <path d='M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z'></path>
                      </g>
                    </svg>
                  </div>
                </div>
              </button>
            </div>
            {/* /UserMenu */}
          </div>
        </div>
        {/* /Left */}

        {/* Middle */}
        <div className='w-full sm:w-610 h-screen sm:mx-6'>
          <Outlet />
        </div>
        {/* /Middle */}

        {/* Right */}
        <div className='hidden md:block w-290 lg:w-360 h-screen'>
          <div className='flex flex-col fixed overflow-y-auto w-290 lg:w-360 h-screen pb-10'>
            {/* Search */}
            <div className='relative m-1'>
              <div className='absolute text-zinc-500 flex items-center pl-4 h-full cursor-pointer'>
                <svg
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='w-4.5 h-4.5'
                >
                  <g>
                    <path d='M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z'></path>
                  </g>
                </svg>
              </div>

              <input
                className='w-full bg-zinc-800 text-gray-100 focus:outline-none focus:border focus:border-blue h-11 pl-12 text-sm rounded-full shadow'
                placeholder='Recherche Twitter'
              />
            </div>
            {/* /Search */}

            {/* What's happening */}
            <div className='bg-zinc-800 rounded-2xl mx-1 my-2'>
              <h1 className='text-white text-xl font-bold p-3'>
                Tendances pour vous
              </h1>

              {/* Trending Topic */}
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className='p-3 hover:bg-gray-50/10 cursor-pointer transition-colors'
                >
                  <h2 className='font-bold text-md'>#FreePS5Monday</h2>
                  <p className='text-xs text-gray-400'>29.7K Tweets</p>
                </div>
              ))}
              {/* /Trending Topic */}

              <div className='text-blue text-sm p-3 rounded-b-2xl hover:bg-gray-50/10 cursor-pointer transition-colors'>
                Voir plus
              </div>
            </div>
            {/* /What's happening */}

            {/* Who to follow */}
            <div className='bg-zinc-800 rounded-2xl m-1'>
              <h1 className='text-white text-xl font-bold p-3'>Suggestions</h1>

              {/* Twitter Account */}
              <div className='p-3 hover:bg-gray-50/10 cursor-pointer transition-colors'>
                <div className='flex justify-between p-2'>
                  <div className='flex'>
                    <img
                      className='w-10 h-10 rounded-full'
                      src='/default_pfp.jpeg'
                      alt='John Doe'
                    />

                    <div className='flex flex-col ml-2 text-sm'>
                      <h1 className='text-white font-bold'>John Doe</h1>
                      <p className='text-gray-400'>@johndoe</p>
                    </div>
                  </div>

                  <div>
                    <div className='flex items-center h-full'>
                      <a
                        href='#'
                        className='text-sm font-bold px-4 py-2 rounded-full bg-zinc-100 hover:bg-zinc-100/90 text-black'
                      >
                        Suivre
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Twitter Account */}

              {/* Twitter Account */}
              <div className='p-3 hover:bg-gray-50/10 cursor-pointer transition-colors'>
                <div className='flex justify-between p-2'>
                  <div className='flex'>
                    <img
                      className='w-10 h-10 rounded-full'
                      src='/default_pfp.jpeg'
                      alt='John Doe'
                    />

                    <div className='flex flex-col ml-2 text-sm'>
                      <h1 className='text-white font-bold'>John Doe</h1>
                      <p className='text-gray-400'>@johndoe</p>
                    </div>
                  </div>

                  <div>
                    <div className='flex items-center h-full'>
                      <a
                        href='#'
                        className='text-sm font-bold px-4 py-2 rounded-full bg-zinc-100 hover:bg-zinc-100/90 text-black'
                      >
                        Suivre
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Twitter Account */}

              {/* Loader */}
              <div className='p-5'>
                <div className='animate-pulse flex items-center space-x-2'>
                  <div className='rounded-full bg-gray-400 h-10 w-10'></div>
                  <div className='flex-1 space-y-2 py-1'>
                    <div className='h-4 bg-gray-400 rounded w-1/2'></div>
                    <div className='h-4 bg-gray-400 rounded w-2/5'></div>
                  </div>
                </div>
              </div>
              {/* /Loader */}

              <div className='text-blue text-sm p-3 rounded-b-2xl hover:bg-gray-50/10 cursor-pointer transition-colors'>
                Voir plus
              </div>
            </div>
            {/* /Who to follow */}
          </div>
        </div>
        {/* /Right */}
      </div>
    </div>
  )
}

export default Layout
