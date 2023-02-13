import { useEffect, useState } from 'react'
import HomeLayout from '../components/HomeLayout'
import { FindAllTweetOutput, Tweet } from '../utils/types'
import TweetComponent from '../components/Tweet'
import { Link } from 'react-router-dom'
import Spinner from '../components/Spinner'
import PostTweet from '../components/PostTweet'

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
      <PostTweet />
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
        <Spinner size={32} />
      </div>
    </HomeLayout>
  )
}

export default Home
