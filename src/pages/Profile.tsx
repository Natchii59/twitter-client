import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { selectUser, setUser as setUserStore } from '../stores/authSlice'
import { useEffect, useState } from 'react'
import moment from 'moment'

import { FindOneUserOutput, PaginationTweet, Tweet, User } from '../utils/types'
import TweetComponent from '../components/Tweet'
import Spinner from '../components/Spinner'
import { useFollowUserMutation } from '../stores/authApiSlice'
import { AppDispatch } from '../stores'

function Profile() {
  const { username } = useParams()

  const [user, setUser] = useState<User | null>(null)
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [tweetsCount, setTweetsCount] = useState<number>(0)

  const [userLoading, setUserLoading] = useState<boolean>(false)
  const [tweetsLoading, setTweetsLoading] = useState<boolean>(false)

  const [refreshTweets, setTweetsRefresh] = useState<boolean>(false)
  const [end, setEnd] = useState<boolean>(false)

  const [skip, setSkip] = useState<number>(0)
  const take = 20
  const createdAt = new Date(Date.now())

  const [follow] = useFollowUserMutation()
  const currentUser = useSelector(selectUser)
  const dispatch = useDispatch<AppDispatch>()

  const isCurrentUser = currentUser?.username === username

  useEffect(() => {
    const userController = new AbortController()

    const fetchUser = async () => {
      if (userController.signal.aborted) return

      setUserLoading(true)

      try {
        const result = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/graphql`,
          {
            signal: userController.signal,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              query: `
                query($input: FindOneUserInput!) {
                  FindOneUser(input: $input) {
                    id
                    username
                    name
                    createdAt
                    birthday
                    followers {
                      id
                    }
                    following {
                      id
                    }
                  }
                }
              `,
              variables: {
                input: {
                  username
                }
              }
            })
          }
        )

        const data: FindOneUserOutput = await result.json()

        setUser(data.data.FindOneUser)
      } catch (err: any) {
        if (err.name === 'AbortError') return
        console.error(err)
      }

      setUserLoading(false)
    }

    const init = async () => {
      if (isCurrentUser) {
        setUser(currentUser)
      } else {
        await fetchUser()
      }

      setTweetsRefresh(true)
    }

    init()

    return () => {
      userController.abort()
    }
  }, [username])

  useEffect(() => {
    const tweetsController = new AbortController()

    const fetchTweets = async () => {
      if (tweetsController.signal.aborted) return

      setTweetsLoading(true)

      try {
        const result = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/graphql`,
          {
            signal: tweetsController.signal,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              query: `
                query($skip: Int!, $take: Int!, $sortBy: PaginationSortBy, $where: [PaginationTweetWhere]) {
                  PaginationTweet(skip: $skip, take: $take, sortBy: $sortBy, where: $where) {
                    totalCount
                    nodes {
                      id
                      text
                      createdAt
                      repliesCount
                      replyTo {
                        id
                        user {
                          id
                          name
                        }
                      }
                      likes {
                        id
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
                sortBy: {
                  createdAt: 'DESC'
                },
                where: [
                  {
                    user: {
                      username
                    },
                    createdAt
                  },
                  {
                    retweetedBy: {
                      username
                    },
                    createdAt
                  }
                ]
              }
            })
          }
        )

        const { data }: PaginationTweet = await result.json()

        if (skip === 0) setTweets(data.PaginationTweet.nodes)
        else setTweets(prev => [...prev, ...data.PaginationTweet.nodes])

        setTweetsCount(data.PaginationTweet.totalCount)

        setSkip(prev => prev + take)

        if (data.PaginationTweet.totalCount === tweets.length) {
          setEnd(true)
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return
        console.error(err)
      }

      setTweetsLoading(false)
    }

    const init = async () => {
      if (user && refreshTweets) {
        await fetchTweets()
        setTweetsRefresh(false)
      }
    }

    init()

    return () => {
      tweetsController.abort()
    }
  }, [user, refreshTweets])

  useEffect(() => {
    if (tweets.length === 0 || tweetsLoading || end) return

    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const scrollBottom = scrollTop + windowHeight

      if (scrollBottom >= documentHeight) {
        setTweetsRefresh(true)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [tweets])

  const followHandle = async () => {
    if (!user || !currentUser) return

    const { data, errors } = await follow({ id: user.id }).unwrap()

    if (errors) {
      console.error(errors)
      return
    }

    if (data) {
      setUser(data.FollowUser)

      if (data.FollowUser.followers.find(f => f.id === currentUser.id)) {
        dispatch(
          setUserStore({
            ...currentUser,
            following: [...currentUser.following, user]
          })
        )
      } else {
        dispatch(
          setUserStore({
            ...currentUser,
            following: currentUser.following.filter(f => f.id !== user.id)
          })
        )
      }
    }
  }

  if (userLoading)
    return (
      <div className='flex justify-center p-4'>
        <Spinner size={40} />
      </div>
    )

  if (!user)
    return (
      <div className='flex justify-center p-4 text-xl font-bold'>
        L&apos;utilisateur est introuvable
      </div>
    )

  return (
    <>
      {/* Header */}
      <div className='flex items-center gap-8 px-4 py-1 sticky top-0 border-x border-zinc-800 bg-black/70 z-50'>
        <Link to='/'>
          <svg viewBox='0 0 24 24' fill='currentColor' className='w-5 h-5'>
            <g>
              <path d='M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z'></path>
            </g>
          </svg>
        </Link>

        <div className='flex flex-col items-start'>
          <h2 className='font-bold text-xl'>{user?.name}</h2>
          <p className='text-sm text-zinc-500'>{tweetsCount} Tweets</p>
        </div>
      </div>
      {/* /Header */}

      <div className='border-x border-zinc-800'>
        <div className='h-52 bg-zinc-400' />
      </div>

      <div className='relative border-x border-b border-zinc-800'>
        <div className='absolute -top-16 left-8 transform p-1 bg-black rounded-full'>
          <img
            src='/default_pfp.jpeg'
            alt='Profile'
            className='w-32 h-32 rounded-full'
          />
        </div>

        <div className='absolute top-0 right-0 px-4 py-2'>
          {isCurrentUser ? (
            <button className='rounded-full px-4 py-1 border border-zinc-600 font-semibold hover:bg-zinc-900'>
              Éditer le profil
            </button>
          ) : currentUser?.following.find(f => f.id === user?.id) ? (
            <button
              onClick={followHandle}
              className='rounded-full px-4 py-1 bg-zinc-100 text-black font-semibold hover:bg-zinc-100/90 transition-colors'
            >
              Abonné
            </button>
          ) : (
            <button
              onClick={followHandle}
              className='rounded-full px-4 py-1 bg-zinc-100 text-black font-semibold hover:bg-zinc-100/90 transition-colors'
            >
              Suivre
            </button>
          )}
        </div>

        <div className='pt-20 flex flex-col items-start px-4 pb-2'>
          <h2 className='font-bold text-xl'>{user?.name}</h2>
          <p className='text-base text-zinc-500'>@{user?.username}</p>
        </div>

        <div className='flex items-center gap-4 px-4 pb-2 text-zinc-500'>
          {user?.birthday && (
            <div className='flex items-center gap-1 text-sm'>
              <svg
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-4.5 h-4.5'
              >
                <g>
                  <path d='M8 10c0-2.21 1.79-4 4-4v2c-1.1 0-2 .9-2 2H8zm12 1c0 4.27-2.69 8.01-6.44 8.83L15 22H9l1.45-2.17C6.7 19.01 4 15.27 4 11c0-4.84 3.46-9 8-9s8 4.16 8 9zm-8 7c3.19 0 6-3 6-7s-2.81-7-6-7-6 3-6 7 2.81 7 6 7z'></path>
                </g>
              </svg>

              <p>
                Naissance le {moment(user?.birthday).format('DD MMMM YYYY')}
              </p>
            </div>
          )}

          <div className='flex items-center gap-1 text-sm'>
            <svg
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-4.5 h-4.5'
            >
              <g>
                <path d='M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z'></path>
              </g>
            </svg>

            <p>
              A rejoint Twitter en {moment(user?.createdAt).format('MMMM YYYY')}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-4 px-4 pb-4 text-zinc-500 text-sm'>
          {/* TODO: Vérification pluriels */}
          <Link
            to={`/profile/${user?.username}/following`}
            className='flex items-center gap-1'
          >
            <span className='text-zinc-100 font-bold'>
              {user?.following.length}
            </span>
            abonnement
          </Link>

          <Link
            to={`/profile/${user?.username}/followers`}
            className='flex items-center gap-1'
          >
            <span className='text-zinc-100 font-bold'>
              {user?.followers.length}
            </span>
            abonné
          </Link>
        </div>
      </div>

      <div>
        {tweets.map(tweet => (
          <TweetComponent key={tweet.id} tweet={tweet} />
        ))}
      </div>

      {tweetsLoading && (
        <div className='flex items-center justify-center p-4 border-b border-l border-r border-zinc-800'>
          <Spinner size={32} />
        </div>
      )}
    </>
  )
}

export default Profile
