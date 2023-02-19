import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import moment from 'moment'

import { FindOneTweetOutput, PaginationTweet, Tweet } from '../utils/types'
import { selectUser } from '../stores/authSlice'
import {
  useDeleteTweetMutation,
  useLikeTweetMutation,
  useRetweetTweetMutation
} from '../stores/authApiSlice'
import Spinner from '../components/Spinner'
import ShareModal from '../components/ShareModal'
import TweetComponent from '../components/Tweet'
import PostReply from '../components/PostReply'

function TweetPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [tweet, setTweet] = useState<Tweet | null>(null)
  const [tweetLoading, setTweetLoading] = useState<boolean>(false)

  const [likes, setLikes] = useState<number>(0)
  const [isLiked, setIsLiked] = useState<boolean>(false)

  const [retweets, setRetweets] = useState<number>(0)
  const [isRetweeted, setIsRetweeted] = useState<boolean>(false)
  const [retweetUsers, setRetweetUsers] = useState<string[]>([])

  const [isShared, setIsShared] = useState<boolean>(false)

  const [replies, setReplies] = useState<Tweet[]>([])
  const [repliesLoading, setRepliesLoading] = useState<boolean>(false)
  const [refreshReplies, setRefreshReplies] = useState<boolean>(false)
  const [end, setEnd] = useState<boolean>(false)

  const [createdAt, setCreatedAt] = useState<Date>(new Date(Date.now()))
  const [skip, setSkip] = useState<number>(0)
  const take = 20

  const user = useSelector(selectUser)

  const [likeTweet] = useLikeTweetMutation()
  const [retweetTweet] = useRetweetTweetMutation()
  const [deleteTweet] = useDeleteTweetMutation()

  useEffect(() => {
    const tweetController = new AbortController()

    const fetchTweet = async () => {
      if (tweetController.signal.aborted) return

      setTweetLoading(true)

      try {
        const result = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/graphql`,
          {
            signal: tweetController.signal,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              query: `
              query($id: ID!) {
                FindOneTweet(id: $id) {
                  id
                  text
                  createdAt
                  replyTo {
                    id
                    text
                    createdAt
                    repliesCount
                    user {
                      id
                      username
                      name
                    }
                    likes {
                      id
                      username
                    }
                    retweets {
                      id
                      username
                    }
                  }
                  likes {
                    id
                    username
                  }
                  retweets {
                    id
                    username
                  }
                  user {
                    id
                    username
                    name
                  }
                }
              }
            `,
              variables: {
                id
              }
            })
          }
        )

        const { data, errors }: FindOneTweetOutput = await result.json()

        if (errors) {
          console.error(errors)
          return
        }

        const tweet = data.FindOneTweet

        setTweet(tweet)

        setLikes(tweet.likes.length)
        setRetweets(tweet.retweets.length)

        setIsLiked(!!tweet.likes.find(like => like.id === user?.id))
        setIsRetweeted(
          !!tweet.retweets.find(retweet => retweet.id === user?.id)
        )
        setRetweetUsers(
          tweet.retweets
            .filter(retweet => user?.following.find(u => u.id === retweet.id))
            .map(retweet => retweet.username)
        )
      } catch (err: any) {
        if (err.name === 'AbortError') return
        console.error(err)
      }

      setTweetLoading(false)
    }

    const init = async () => {
      if (!user) return

      await fetchTweet()
      setRefreshReplies(true)
    }

    init()

    return () => {
      tweetController.abort()
    }
  }, [id, user])

  useEffect(() => {
    const repliesController = new AbortController()

    const fetchReplies = async () => {
      if (repliesController.signal.aborted) return

      setRepliesLoading(true)

      try {
        const result = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/graphql`,
          {
            signal: repliesController.signal,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              query: `
                query($skip: Int!, $take: Int!, $where: PaginationTweetWhere, $sortBy: PaginationSortBy) {
                  PaginationTweet(skip: $skip, take: $take, where: $where, sortBy: $sortBy) {
                    totalCount
                    nodes {
                      id
                      text
                      createdAt
                      repliesCount
                      likes {
                        id
                        username
                      }
                      retweets {
                        id
                        username
                      }
                      user {
                        id
                        username
                        name
                      }
                    }
                  }
                }
              `,
              variables: {
                skip,
                take,
                where: {
                  replyTo: tweet?.id,
                  createdAt
                },
                sortBy: {
                  createdAt: 'DESC'
                }
              }
            })
          }
        )

        const { data }: PaginationTweet = await result.json()

        if (skip === 0) setReplies(data.PaginationTweet.nodes)
        else setReplies(prev => [...prev, ...data.PaginationTweet.nodes])

        setSkip(prev => prev + take)

        if (data.PaginationTweet.totalCount === replies.length) {
          setEnd(true)
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return
        console.error(err)
      }

      setRepliesLoading(false)
    }

    const init = async () => {
      if (tweet && refreshReplies) {
        await fetchReplies()
        setRefreshReplies(false)
      }
    }

    init()

    return () => {
      repliesController.abort()
    }
  }, [tweet, refreshReplies])

  useEffect(() => {
    if (replies.length === 0 || repliesLoading || end) return

    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const scrollBottom = scrollTop + windowHeight

      if (scrollBottom >= documentHeight) {
        setRefreshReplies(true)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [replies])

  const handleLike = async () => {
    if (!tweet) return

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
    if (!tweet) return

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
    if (!tweet) return

    const { data, errors } = await deleteTweet({ id: tweet.id }).unwrap()

    if (errors) {
      console.error(errors)
      return
    } else if (data) {
      navigate('/')
    }
  }

  const handleShare = () => {
    if (!tweet) return

    navigator.clipboard.writeText(`http://localhost:5173/tweet/${tweet.id}`)
    setIsShared(true)
  }

  if (tweetLoading)
    return (
      <div className='flex justify-center p-4'>
        <Spinner size={40} />
      </div>
    )

  if (!tweet)
    return (
      <div className='flex justify-center p-4 text-xl font-bold'>
        Le Tweet est introuvable
      </div>
    )

  return (
    <>
      {/* Header */}
      <div className='flex items-center gap-8 px-4 py-1 sticky top-0 border-x border-zinc-800 bg-black/70 z-50'>
        <Link to='/'>
          <svg viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
            <g>
              <path d='M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z'></path>
            </g>
          </svg>
        </Link>

        <div className='flex flex-col items-start'>
          <h2 className='font-bold text-xl'>Tweet</h2>
        </div>
      </div>
      {/* /Header */}

      <div className='border-b border-zinc-800 p-3 pb-2 border-l border-r flex flex-col items-start gap-2'>
        {tweet.replyTo && (
          <TweetComponent tweet={tweet.replyTo} isReplyTo={true} />
        )}

        {retweetUsers.length > 0 && (
          <div className='flex items-center gap-2 text-sm text-zinc-500'>
            <svg
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-4.5 h-4.5'
            >
              <g>
                <path d='M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z'></path>
              </g>
            </svg>

            <span>
              {retweetUsers
                .slice(0, 2)
                .concat(retweetUsers.length > 2 ? 'et d’autres' : [])
                .join(', ')}{' '}
              {retweetUsers.length > 1 ? 'ont' : 'a'} retweeté
              {retweetUsers.length > 1 && 's'}
            </span>
          </div>
        )}

        <div className='flex items-center justify-between w-full mb-2'>
          <Link
            to={`/profile/${tweet.user.username}`}
            className='flex items-center gap-2'
          >
            <img
              className='w-12 h-12 rounded-full'
              src='/default_pfp.jpeg'
              alt='Profile'
            />

            <div className='flex flex-col items-start'>
              <span className='font-bold hover:underline'>
                {tweet.user.name}
              </span>
              <span className=' text-zinc-500'>@{tweet.user.username}</span>
            </div>
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

        <p className='text-lg break-all'>{tweet.text}</p>

        <p className='text-zinc-500 w-full border-b border-zinc-800 py-2'>
          {moment(tweet.createdAt).format('HH:mm · DD MMM YYYY')}
        </p>

        <div className='flex items-center gap-4 w-full py-2 text-sm border-b border-zinc-800'>
          <p className='font-bold'>
            {retweets}{' '}
            <span className='text-zinc-500 font-normal'>
              Retweet{retweets > 1 && 's'}
            </span>
          </p>

          <p className='font-bold'>
            {likes}{' '}
            <span className='text-zinc-500 font-normal'>
              J’aime{likes > 1 && 's'}
            </span>
          </p>
        </div>

        <div className='flex items-center justify-around py-1 w-full border-b border-zinc-800'>
          {/* Comments */}
          <button className=' text-zinc-500 hover:text-blue transition-colors group'>
            <div className='p-2 rounded-full group-hover:bg-blue/10 group-active:bg-blue/20'>
              <svg viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
                <g>
                  <path d='M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z'></path>
                </g>
              </svg>
            </div>
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
              <svg viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
                <g>
                  <path d='M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z'></path>
                </g>
              </svg>
            </div>
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
                  className='w-6 h-6 '
                >
                  <g>
                    <path d='M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z'></path>
                  </g>
                </svg>
              ) : (
                <svg
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='w-6 h-6 '
                >
                  <g>
                    <path d='M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z'></path>
                  </g>
                </svg>
              )}
            </div>
          </button>
          {/* /Likes */}

          {/* Share */}
          <button
            onClick={handleShare}
            className='text-zinc-500 hover:text-blue p-2 rounded-full hover:bg-blue/10 active:bg-blue/20 transition-colors'
          >
            <svg viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
              <g>
                <path d='M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z'></path>
              </g>
            </svg>
          </button>

          <ShareModal isOpen={isShared} setIsOpen={setIsShared} />
          {/* /Share */}
        </div>

        <PostReply
          tweetId={tweet.id}
          setRefresh={setRefreshReplies}
          setCreatedAt={setCreatedAt}
          setSkip={setSkip}
        />
      </div>

      {replies.map(reply => (
        <TweetComponent key={reply.id} tweet={reply} setTweets={setReplies} />
      ))}

      {repliesLoading && (
        <div className='flex items-center justify-center p-4 border-b border-l border-r border-zinc-800'>
          <Spinner size={32} />
        </div>
      )}
    </>
  )
}

export default TweetPage
