import { useEffect, useState } from 'react'
import HomeLayout from '../components/HomeLayout'
import { FindAllTweetOutput, Tweet } from '../utils/types'
import TweetComponent from '../components/Tweet'
import { Link } from 'react-router-dom'
import Spinner from '../components/Spinner'

function Home() {
  const [tweet, setTweet] = useState<string>('')
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)

    fetch('http://localhost:3001/graphql', {
      signal: controller.signal,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `
          query {
            FindAllTweet{
              id
              text
              createdAt
              user {
                username
                name
              }
            }
          }
        `
      })
    })
      .then(res => res.json())
      .then((data: FindAllTweetOutput) => {
        setTweets(data.data.FindAllTweet)
        setLoading(false)
      })
      .catch(console.error)

    return () => controller.abort()
  }, [])

  return (
    <HomeLayout>
      {/* Header */}
      <div className='flex justify-between items-center border-b px-4 py-3 sticky top-0 border-l border-r border-zinc-800 backdrop-blur-md'>
        {/* Title */}
        <h2 className='text-zinc-100 font-bold text-xl'>Accueil</h2>
        {/* /Title */}
      </div>
      {/* /Header */}

      {/* Post Tweet */}
      <div className='border-b border-zinc-800 pb-4 border-l border-r'>
        <div className='flex items-start p-4'>
          <img
            className='h-12 w-12 rounded-full'
            src='/default_pfp.jpeg'
            alt='Profile'
          />

          <div className='flex-1 p-2'>
            <textarea
              className='text-white placeholder-zinc-500 text-xl w-full h-16 bg-transparent border-none focus:outline-none resize-none p-1'
              placeholder='Quoi de neuf ?'
            />

            <div className='w-full flex'>
              <button className='text-blue hover:bg-blue/10 rounded-full p-2 active:bg-blue/20'>
                <svg
                  viewBox='0 0 24 24'
                  className='w-5 h-5'
                  fill='currentColor'
                >
                  <g>
                    <path d='M19.75 2H4.25C3.01 2 2 3.01 2 4.25v15.5C2 20.99 3.01 22 4.25 22h15.5c1.24 0 2.25-1.01 2.25-2.25V4.25C22 3.01 20.99 2 19.75 2zM4.25 3.5h15.5c.413 0 .75.337.75.75v9.676l-3.858-3.858c-.14-.14-.33-.22-.53-.22h-.003c-.2 0-.393.08-.532.224l-4.317 4.384-1.813-1.806c-.14-.14-.33-.22-.53-.22-.193-.03-.395.08-.535.227L3.5 17.642V4.25c0-.413.337-.75.75-.75zm-.744 16.28l5.418-5.534 6.282 6.254H4.25c-.402 0-.727-.322-.744-.72zm16.244.72h-2.42l-5.007-4.987 3.792-3.85 4.385 4.384v3.703c0 .413-.337.75-.75.75z'></path>
                    <circle cx='8.868' cy='8.309' r='1.542'></circle>
                  </g>
                </svg>
              </button>

              <button className='text-blue hover:bg-blue/10 rounded-full p-2 active:bg-blue/20'>
                <svg
                  viewBox='0 0 24 24'
                  className='w-5 h-5'
                  fill='currentColor'
                >
                  <g>
                    <path d='M19 10.5V8.8h-4.4v6.4h1.7v-2h2v-1.7h-2v-1H19zm-7.3-1.7h1.7v6.4h-1.7V8.8zm-3.6 1.6c.4 0 .9.2 1.2.5l1.2-1C9.9 9.2 9 8.8 8.1 8.8c-1.8 0-3.2 1.4-3.2 3.2s1.4 3.2 3.2 3.2c1 0 1.8-.4 2.4-1.1v-2.5H7.7v1.2h1.2v.6c-.2.1-.5.2-.8.2-.9 0-1.6-.7-1.6-1.6 0-.8.7-1.6 1.6-1.6z'></path>
                    <path d='M20.5 2.02h-17c-1.24 0-2.25 1.007-2.25 2.247v15.507c0 1.238 1.01 2.246 2.25 2.246h17c1.24 0 2.25-1.008 2.25-2.246V4.267c0-1.24-1.01-2.247-2.25-2.247zm.75 17.754c0 .41-.336.746-.75.746h-17c-.414 0-.75-.336-.75-.746V4.267c0-.412.336-.747.75-.747h17c.414 0 .75.335.75.747v15.507z'></path>
                  </g>
                </svg>
              </button>

              <button className='text-blue hover:bg-blue/10 rounded-full p-2 active:bg-blue/20'>
                <svg
                  viewBox='0 0 24 24'
                  className='w-5 h-5'
                  fill='currentColor'
                >
                  <g>
                    <path d='M20.222 9.16h-1.334c.015-.09.028-.182.028-.277V6.57c0-.98-.797-1.777-1.778-1.777H3.5V3.358c0-.414-.336-.75-.75-.75s-.75.336-.75.75V20.83c0 .415.336.75.75.75s.75-.335.75-.75v-1.434h10.556c.98 0 1.778-.797 1.778-1.777v-2.313c0-.095-.014-.187-.028-.278h4.417c.98 0 1.778-.798 1.778-1.778v-2.31c0-.983-.797-1.78-1.778-1.78zM17.14 6.293c.152 0 .277.124.277.277v2.31c0 .154-.125.28-.278.28H3.5V6.29h13.64zm-2.807 9.014v2.312c0 .153-.125.277-.278.277H3.5v-2.868h10.556c.153 0 .277.126.277.28zM20.5 13.25c0 .153-.125.277-.278.277H3.5V10.66h16.722c.153 0 .278.124.278.277v2.313z'></path>
                  </g>
                </svg>
              </button>

              <button className='text-blue hover:bg-blue/10 rounded-full p-2 active:bg-blue/20'>
                <svg
                  viewBox='0 0 24 24'
                  className='w-5 h-5'
                  fill='currentColor'
                >
                  <g>
                    <path d='M12 22.75C6.072 22.75 1.25 17.928 1.25 12S6.072 1.25 12 1.25 22.75 6.072 22.75 12 17.928 22.75 12 22.75zm0-20C6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25s9.25-4.15 9.25-9.25S17.1 2.75 12 2.75z'></path>
                    <path d='M12 17.115c-1.892 0-3.633-.95-4.656-2.544-.224-.348-.123-.81.226-1.035.348-.226.812-.124 1.036.226.747 1.162 2.016 1.855 3.395 1.855s2.648-.693 3.396-1.854c.224-.35.688-.45 1.036-.225.35.224.45.688.226 1.036-1.025 1.594-2.766 2.545-4.658 2.545z'></path>
                    <circle cx='14.738' cy='9.458' r='1.478'></circle>
                    <circle cx='9.262' cy='9.458' r='1.478'></circle>
                  </g>
                </svg>
              </button>

              <button className='text-blue hover:bg-blue/10 rounded-full p-2 active:bg-blue/20'>
                <svg
                  viewBox='0 0 24 24'
                  className='w-5 h-5'
                  fill='currentColor'
                >
                  <g>
                    <path d='M-37.9 18c-.1-.1-.1-.1-.1-.2.1 0 .1.1.1.2z'></path>
                    <path d='M-37.9 18c-.1-.1-.1-.1-.1-.2.1 0 .1.1.1.2zM18 2.2h-1.3v-.3c0-.4-.3-.8-.8-.8-.4 0-.8.3-.8.8v.3H7.7v-.3c0-.4-.3-.8-.8-.8-.4 0-.8.3-.8.8v.3H4.8c-1.4 0-2.5 1.1-2.5 2.5v13.1c0 1.4 1.1 2.5 2.5 2.5h2.9c.4 0 .8-.3.8-.8 0-.4-.3-.8-.8-.8H4.8c-.6 0-1-.5-1-1V7.9c0-.3.4-.7 1-.7H18c.6 0 1 .4 1 .7v1.8c0 .4.3.8.8.8.4 0 .8-.3.8-.8v-5c-.1-1.4-1.2-2.5-2.6-2.5zm1 3.7c-.3-.1-.7-.2-1-.2H4.8c-.4 0-.7.1-1 .2V4.7c0-.6.5-1 1-1h1.3v.5c0 .4.3.8.8.8.4 0 .8-.3.8-.8v-.5h7.5v.5c0 .4.3.8.8.8.4 0 .8-.3.8-.8v-.5H18c.6 0 1 .5 1 1v1.2z'></path>
                    <path d='M15.5 10.4c-3.4 0-6.2 2.8-6.2 6.2 0 3.4 2.8 6.2 6.2 6.2 3.4 0 6.2-2.8 6.2-6.2 0-3.4-2.8-6.2-6.2-6.2zm0 11c-2.6 0-4.7-2.1-4.7-4.7s2.1-4.7 4.7-4.7 4.7 2.1 4.7 4.7c0 2.5-2.1 4.7-4.7 4.7z'></path>
                    <path d='M18.9 18.7c-.1.2-.4.4-.6.4-.1 0-.3 0-.4-.1l-3.1-2v-3c0-.4.3-.8.8-.8.4 0 .8.3.8.8v2.2l2.4 1.5c.2.2.3.6.1 1z'></path>
                  </g>
                </svg>
              </button>

              <button className='bg-blue hover:bg-blue/90 active:bg-blue/80 text-white rounded-full py-1 px-4 ml-auto font-bold text-sm'>
                Tweeter
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* /Post Tweet */}

      {/* Timeline */}

      {/* New Tweets */}
      <button className='border-b border-zinc-800 border-l border-r w-full py-4 text-sm text-blue active:bg-gray-50/5'>
        Voir 9 Tweets
      </button>
      {/* /New Tweets */}

      {/* Tweet */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className='border-b border-zinc-800 cursor-pointer p-4 pb-0 border-l border-r flex items-start gap-2'
        >
          <img
            className='w-12 h-12 rounded-full'
            src='default_pfp.jpeg'
            alt='Profile'
          />

          <div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2 text-base text-white'>
                <span className='font-bold'>John Doe</span>
                <span className=' text-zinc-500'>@johndoe · 7 Nov.</span>
              </div>

              <div className='rounded-full p-2 text-zinc-500 hover:text-blue hover:bg-blue/10 active:bg-blue/20'>
                <svg
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='h-5 w-5'
                >
                  <g>
                    <path d='M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z'></path>
                  </g>
                </svg>
              </div>
            </div>

            <p className='text-base text-zinc-100'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
              beatae vitae id error ea, amet sunt eaque voluptatem labore ab
              illo officia quaerat non, fugit alias in dolore corrupti assumenda
              tenetur molestias! Libero dicta aut molestiae nisi eum deleniti
              vitae quas minus velit quibusdam reprehenderit nobis, consequatur
              aspernatur similique ex error eveniet facilis quo molestias hic
              temporibus harum doloribus. Tenetur minima obcaecati libero
              doloribus soluta, ut eius eligendi, qui officia reiciendis
              perferendis fuga ullam vitae et minus quae hic aliquid explicabo
              officiis voluptatibus perspiciatis. Expedita delectus itaque
              pariatur molestias rerum ipsum blanditiis, sapiente inventore
              minus qui architecto placeat recusandae possimus?
            </p>

            <div className='flex items-center justify-between py-1 pb-2 w-full max-w-md'>
              <button className='flex items-center gap-1 text-13 text-zinc-500 hover:text-blue transition-colors group'>
                <div className='p-2 rounded-full group-hover:bg-blue/10 group-active:bg-blue/20'>
                  <svg
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='w-4.5 h-4.5'
                  >
                    <g>
                      <path d='M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z'></path>
                    </g>
                  </svg>
                </div>

                <span>12.3k</span>
              </button>

              <button className='flex items-center gap-1 text-13 text-zinc-500 hover:text-green-500 transition-colors group'>
                <div className='p-2 rounded-full group-hover:bg-green-500/10 group-active:bg-green-500/20'>
                  <svg
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='w-4.5 h-4.5'
                  >
                    <g>
                      <path d='M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z'></path>
                    </g>
                  </svg>
                </div>

                <span>14 k</span>
              </button>

              <button className='flex items-center gap-1 text-13 text-zinc-500 hover:text-pink-600 transition-colors group'>
                <div className='p-2 rounded-full group-hover:bg-red-600/10 group-active:bg-pink-600/20'>
                  <svg
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='w-4.5 h-4.5 '
                  >
                    <g>
                      <path d='M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z'></path>
                    </g>
                  </svg>
                </div>

                <span>14 k</span>
              </button>

              <button className='text-zinc-500 hover:text-blue p-2 rounded-full hover:bg-blue/10 active:bg-blue/20 transition-colors'>
                <svg
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='w-4.5 h-4.5'
                >
                  <g>
                    <path d='M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z'></path>
                  </g>
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
      {/* /Tweet */}

      <div className='flex items-center justify-center p-4 border-b border-l border-r border-zinc-800'>
        <Spinner />
      </div>
    </HomeLayout>
  )
}

export default Home
