import { useEffect, useState } from 'react'

import { PaginationTweet, Tweet } from '../utils/types'
import TweetComponent from '../components/Tweet'
import Spinner from '../components/Spinner'
import PostTweet from '../components/PostTweet'

function Home() {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [refresh, setRefresh] = useState<boolean>(true)
  const [end, setEnd] = useState<boolean>(false)

  const [createdAt, setCreatedAt] = useState<Date>(new Date(Date.now()))
  const [skip, setSkip] = useState<number>(0)
  const take = 20

  useEffect(() => {
    const controller = new AbortController()

    const fetchData = async () => {
      setLoading(true)

      try {
        const result = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/graphql`,
          {
            signal: controller.signal,
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
                where: {
                  createdAt
                }
              }
            })
          }
        )

        const { data }: PaginationTweet = await result.json()

        if (skip === 0) setTweets(data.PaginationTweet.nodes)
        else setTweets(prev => [...prev, ...data.PaginationTweet.nodes])

        setSkip(prev => prev + take)

        if (data.PaginationTweet.totalCount === tweets.length) {
          setEnd(true)
        }

        setRefresh(false)
      } catch (err: any) {
        if (err.name === 'AbortError') return
        console.error(err)
      }

      setLoading(false)
    }

    const init = async () => {
      if (refresh) {
        await fetchData()
      }
    }

    init()

    return () => controller.abort()
  }, [refresh])

  useEffect(() => {
    if (tweets.length === 0 || loading || end) return

    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const scrollBottom = scrollTop + windowHeight

      if (scrollBottom >= documentHeight) {
        setRefresh(true)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [tweets])

  return (
    <>
      {/* Header */}
      <div className='sticky top-0 z-40 w-full flex justify-between items-center px-4 py-3 border-x border-b border-zinc-800 backdrop-blur-md'>
        {/* Title */}
        <h2 className='text-zinc-100 font-bold text-xl'>Accueil</h2>
        {/* /Title */}
      </div>
      {/* /Header */}

      {/* Post Tweet */}
      <PostTweet
        setRefresh={setRefresh}
        setCreatedAt={setCreatedAt}
        setSkip={setSkip}
      />
      {/* /Post Tweet */}

      {/* Tweets */}
      {tweets.map(tweet => (
        <TweetComponent key={tweet.id} tweet={tweet} setTweets={setTweets} />
      ))}
      {/* /Tweets */}

      {loading && (
        <div className='flex items-center justify-center p-4 border-b border-l border-r border-zinc-800'>
          <Spinner size={32} />
        </div>
      )}
    </>
  )
}

export default Home
