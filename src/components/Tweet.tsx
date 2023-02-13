import { Tweet } from '../utils/types'
import { getRelativeDate } from '../utils/functions'
import { FaRegComment, FaRetweet } from 'react-icons/fa'
import { AiOutlineHeart } from 'react-icons/ai'

interface TweetProps {
  tweet: Tweet
}

function TweetComponent({ tweet }: TweetProps) {
  const date = getRelativeDate(tweet.createdAt)

  return (
    <div className='py-3 px-4 border-b border-zinc-600'>
      <div className='flex items-start gap-3'>
        <img
          src='/default_pfp.jpeg'
          alt='Profile'
          className='w-12 h-12 rounded-full'
        />

        <div>
          <div className='flex items-center gap-2'>
            <p className='font-bold text-base'>{tweet.user.name}</p>

            <p className='text-zinc-400'>
              @{tweet.user.username} · {date}
            </p>
          </div>

          <p className='text-base'>{tweet.text}</p>

          <div className='pt-1 flex items-center gap-8 text-zinc-400'>
            <button className='flex items-center group'>
              <div className='p-2 group-hover:bg-blue-400/30 rounded-full'>
                <FaRegComment className='text-lg group-hover:text-blue-500' />
              </div>
              <p className='group-hover:text-blue-500 px-2'>0</p>
            </button>

            <button className='flex items-center group'>
              <div className='p-2 group-hover:bg-green-400/30 rounded-full'>
                <FaRetweet className='text-xl group-hover:text-green-500' />
              </div>
              <p className='group-hover:text-green-500 px-2'>0</p>
            </button>

            <button className='flex items-center group'>
              <div className='p-2 group-hover:bg-pink-400/30 rounded-full'>
                <AiOutlineHeart className='text-xl group-hover:text-pink-500' />
              </div>
              <p className='group-hover:text-pink-500 px-2'>0</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TweetComponent
