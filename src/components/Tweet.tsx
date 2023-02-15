import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Tweet } from '../utils/types'
import { formatNumber, getRelativeDate } from '../utils/functions'
import { selectUser } from '../stores/authSlice'
import {
  useDeleteTweetMutation,
  useLikeTweetMutation,
  useRetweetTweetMutation
} from '../stores/authApiSlice'
import { Link, useLocation, useParams } from 'react-router-dom'

interface TweetProps {
  tweet: Tweet
  setTweets?: React.Dispatch<React.SetStateAction<Tweet[]>>
}

function TweetComponent({ tweet, setTweets }: TweetProps) {
  const location = useLocation()
  const { username } = useParams()

  const [likes, setLikes] = useState<number>(tweet.likes.length)
  const [isLiked, setIsLiked] = useState<boolean>(false)

  const [retweets, setRetweets] = useState<number>(tweet.retweets.length)
  const [isRetweeted, setIsRetweeted] = useState<boolean>(false)
  const [retweetUsers, setRetweetUsers] = useState<string[]>([])

  const user = useSelector(selectUser)

  const [likeTweet] = useLikeTweetMutation()
  const [retweetTweet] = useRetweetTweetMutation()
  const [deleteTweet] = useDeleteTweetMutation()

  const date = getRelativeDate(tweet.createdAt)

  useEffect(() => {
    if (!user) return

    setIsLiked(!!tweet.likes.find(like => like.id === user.id))
    setIsRetweeted(!!tweet.retweets.find(retweet => retweet.id === user.id))
    setRetweetUsers(
      tweet.retweets
        .filter(retweet => user.following.find(u => u.id === retweet.id))
        .map(retweet => retweet.username)
    )

    if (tweet.retweets.find(retweet => retweet.id === user.id))
      setRetweetUsers(prev => [user.username, ...prev])
    else if (
      username &&
      location.pathname === `/profile/${username}` &&
      tweet.retweets.find(retweet => retweet.username === username)
    ) {
      setRetweetUsers(prev => [...prev, username])
    }
  }, [user])

  const handleLike = async () => {
    const { data, errors } = await likeTweet({ id: tweet.id }).unwrap()

    if (errors) {
      console.error(errors)
      return
    } else if (data) {
      setIsLiked(!isLiked)
      setLikes(isLiked ? likes - 1 : likes + 1)
    }
  }

  const handleRetweet = async () => {
    const { data, errors } = await retweetTweet({ id: tweet.id }).unwrap()

    if (errors) {
      console.error(errors)
      return
    } else if (data) {
      setIsRetweeted(!isRetweeted)
      setRetweets(isRetweeted ? retweets - 1 : retweets + 1)
    }
  }

  const handleDelete = async () => {
    const { data, errors } = await deleteTweet({ id: tweet.id }).unwrap()

    if (errors) {
      console.error(errors)
      return
    } else if (data) {
      if (typeof setTweets !== 'undefined') {
        setTweets(prev => prev.filter(t => t.id !== data.DeleteTweet))
      }
    }
  }

  return (
    <div className='border-b border-zinc-800 cursor-pointer p-3 pb-0 border-l border-r flex flex-col items-start gap-2'>
      {retweetUsers.length > 0 && (
        <div className='flex items-center gap-2 text-sm text-zinc-500 pl-7'>
          <svg viewBox='0 0 24 24' fill='currentColor' className='w-4.5 h-4.5'>
            <g>
              <path d='M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z'></path>
            </g>
          </svg>

          <span>
            {retweetUsers
              .map(u => (u === user?.username ? 'Vous' : u))
              .join(', ')}{' '}
            {retweetUsers.length > 1
              ? 'ont'
              : retweetUsers[0] === user?.username
              ? 'avez'
              : 'a'}{' '}
            retweeté{retweetUsers.length > 1 && 's'}
          </span>
        </div>
      )}

      <div className='flex items-start gap-2 w-full'>
        <Link to={`/profile/${tweet.user.username}`}>
          <img
            className='w-12 h-12 rounded-full'
            src='/default_pfp.jpeg'
            alt='Profile'
          />
        </Link>

        <div className='flex-1'>
          <div className='flex items-center justify-between'>
            <Link
              to={`/profile/${tweet.user.username}`}
              className='flex items-center gap-2 text-base text-white'
            >
              <span className='font-bold hover:underline'>
                {tweet.user.name}
              </span>
              <span className=' text-zinc-500'>
                @{tweet.user.username} · {date}
              </span>
            </Link>

            {user?.id === tweet.user.id && (
              <button
                onClick={handleDelete}
                className='rounded-full p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 active:bg-red-500/20'
              >
                <svg
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='h-4.5 w-4.5'
                >
                  <g>
                    <path d='M16 6V4.5C16 3.12 14.88 2 13.5 2h-3C9.11 2 8 3.12 8 4.5V6H3v2h1.06l.81 11.21C4.98 20.78 6.28 22 7.86 22h8.27c1.58 0 2.88-1.22 3-2.79L19.93 8H21V6h-5zm-6-1.5c0-.28.22-.5.5-.5h3c.27 0 .5.22.5.5V6h-4V4.5zm7.13 14.57c-.04.52-.47.93-1 .93H7.86c-.53 0-.96-.41-1-.93L6.07 8h11.85l-.79 11.07zM9 17v-6h2v6H9zm4 0v-6h2v6h-2z'></path>
                  </g>
                </svg>
              </button>
            )}
          </div>

          <p className='text-base text-zinc-100'>{tweet.text}</p>

          <div className='flex items-center justify-between py-1 pb-2 w-full max-w-md'>
            {/* Comments */}
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

              <span>{formatNumber(12300)}</span>
            </button>
            {/* /Comments */}

            {/* Retweets */}
            <button
              onClick={handleRetweet}
              className={`flex items-center gap-1 text-13 hover:text-green-500 transition-colors group ${
                isRetweeted ? 'text-green-500' : 'text-zinc-500'
              }`}
            >
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

              <span>{formatNumber(retweets)}</span>
            </button>
            {/* /Retweets */}

            {/* Likes */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-13 hover:text-pink-600 transition-colors group ${
                isLiked ? 'text-pink-600' : 'text-zinc-500'
              }`}
            >
              <div className='p-2 rounded-full group-hover:bg-red-600/10 group-active:bg-pink-600/20'>
                {isLiked ? (
                  <svg
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='w-4.5 h-4.5 '
                  >
                    <g>
                      <path d='M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z'></path>
                    </g>
                  </svg>
                ) : (
                  <svg
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='w-4.5 h-4.5 '
                  >
                    <g>
                      <path d='M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z'></path>
                    </g>
                  </svg>
                )}
              </div>

              <span>{formatNumber(likes)}</span>
            </button>
            {/* /Likes */}

            {/* Share */}
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
            {/* /Share */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TweetComponent
