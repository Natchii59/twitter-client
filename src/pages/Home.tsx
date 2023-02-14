import { useEffect, useState } from 'react'
import { PaginationTweet, Tweet } from '../utils/types'
import TweetComponent from '../components/Tweet'
import Spinner from '../components/Spinner'
import PostTweet from '../components/PostTweet'

function Home() {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [refresh, setRefresh] = useState<boolean>(true)

  useEffect(() => {
    if (!refresh) return

    setLoading(true)

    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `
          query($skip: Int!, $take: Int!, $sortBy:PaginationSortBy) {
            PaginationTweet(skip: $skip, take: $take, sortBy: $sortBy) {
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
          sortBy: {
            createdAt: 'DESC'
          }
        }
      })
    })
      .then(res => res.json())
      .then((data: PaginationTweet) => {
        setTweets(data.data.PaginationTweet.nodes)
        setLoading(false)
        setRefresh(false)
      })
      .catch(console.error)
  }, [refresh])

  return (
    <>
      {/* Header */}
      <div className='flex justify-between items-center border-b px-4 py-3 sticky top-0 border-l border-r border-zinc-800 backdrop-blur-md'>
        {/* Title */}
        <h2 className='text-zinc-100 font-bold text-xl'>Accueil</h2>
        {/* /Title */}
      </div>
      {/* /Header */}

      {/* Post Tweet */}
      <PostTweet setRefresh={setRefresh} />
      {/* /Post Tweet */}

      {/* Tweets */}
      {tweets.map(tweet => (
        <TweetComponent key={tweet.id} tweet={tweet} />
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
