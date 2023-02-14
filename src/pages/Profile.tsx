import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { selectUser } from '../stores/authSlice'
import { useEffect, useState } from 'react'
import { FindOneUserOutput, PaginationTweet, Tweet, User } from '../utils/types'
import moment from 'moment'
import TweetComponent from '../components/Tweet'

function Profile() {
  const { username } = useParams()

  const [loading, setLoading] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [tweetsCount, setTweetsCount] = useState<number>(0)

  const currentUser = useSelector(selectUser)
  const isCurrentUser = currentUser?.username === username

  useEffect(() => {
    setLoading(true)

    if (!isCurrentUser) {
      fetchUser()
    } else {
      setUser(currentUser)
      fetchTweets()
    }
  }, [username])

  const fetchUser = () => {
    fetch('http://localhost:3001/graphql', {
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
    })
      .then(res => res.json())
      .then((data: FindOneUserOutput) => {
        setUser(data.data.FindOneUser)
        fetchTweets()
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  const fetchTweets = () => {
    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `
          query($skip: Int!, $take: Int!, $sortBy: PaginationSortBy, $where: PaginationTweetWhere) {
            PaginationTweet(skip: $skip, take: $take, sortBy: $sortBy, where: $where) {
              totalCount
              nodes {
                id
                text
                createdAt
                likes {
                  id
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
          skip: 0,
          take: 10,
          where: {
            username
          },
          sortBy: {
            createdAt: 'DESC'
          }
        }
      })
    })
      .then(res => res.json())
      .then((data: PaginationTweet) => {
        setTweetsCount(data.data.PaginationTweet.totalCount)
        setTweets(data.data.PaginationTweet.nodes)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  return (
    <>
      {/* Header */}
      <div className='flex items-center gap-8 px-4 py-1 sticky top-0 border-x border-zinc-800 bg-black/70'>
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
          ) : (
            <button className='rounded-full px-4 py-1 bg-zinc-100 text-black font-semibold hover:bg-zinc-100/90 transition-colors'>
              Suivre
            </button>
          )}
        </div>

        <div className='pt-20 flex flex-col items-start px-4 pb-2'>
          <h2 className='font-bold text-xl'>{user?.name}</h2>
          <p className='text-base text-zinc-500'>@{user?.username}</p>
        </div>

        <div className='flex items-center gap-4 px-4 pb-2 text-zinc-500'>
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
    </>
  )
}

export default Profile
