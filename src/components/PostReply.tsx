import { createRef, useEffect, useState } from 'react'
import { useReplyTweetMutation } from '../stores/authApiSlice'
import { ErrorMessage } from '../utils/types'

interface PostReplyProps {
  tweetId: string
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
  setCreatedAt: React.Dispatch<React.SetStateAction<Date>>
  setSkip: React.Dispatch<React.SetStateAction<number>>
}

function PostReply({
  tweetId,
  setRefresh,
  setCreatedAt,
  setSkip
}: PostReplyProps) {
  const [tweet, setTweet] = useState<string>('')
  const [tweetValid, setTweetValid] = useState<boolean>(false)
  const [errors, setErrors] = useState<ErrorMessage[]>([])

  const textAreaRef = createRef<HTMLTextAreaElement>()

  const [replyTweet, { isLoading }] = useReplyTweetMutation()

  const updateTweet = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value)
    setErrors(prev => prev.filter(err => err.code !== 'text'))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { data, errors } = await replyTweet({
      id: tweetId,
      text: tweet.trim()
    }).unwrap()

    if (errors) {
      if (errors[0].statusCode === 400) {
        const messages = errors[0].message
        if (Array.isArray(messages)) {
          setErrors(messages)
        } else {
          setErrors([{ message: messages, code: '' }])
        }
      }
    } else if (data) {
      setTweet('')
      setErrors([])
      setSkip(0)
      setCreatedAt(new Date(Date.now()))
      setRefresh(true)
    }
  }

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = '0'

      const textAreaHeight = textAreaRef.current.scrollHeight
      textAreaRef.current.style.height = `${textAreaHeight}px`
    }

    if (tweet.trim().length > 0 && tweet.length <= 280) {
      setTweetValid(true)
    } else {
      setTweetValid(false)
    }
  }, [tweet])

  return (
    <form
      onSubmit={handleSubmit}
      className='py-2 flex items-start gap-4 w-full'
    >
      <img
        className='w-12 h-12 rounded-full'
        src='/default_pfp.jpeg'
        alt='Profile'
      />

      <div className='flex-1'>
        <textarea
          ref={textAreaRef}
          className={`text-white placeholder-zinc-500 text-xl h-8 rounded-lg bg-transparent focus:outline-none resize-none p-1 w-full ${
            errors.find(err => err.code === 'text')
              ? 'border border-red-500'
              : 'border border-transparent'
          }`}
          placeholder='Tweetez votre réponse.'
          value={tweet}
          onChange={updateTweet}
          maxLength={280}
        />

        {!!errors.find(err => err.code === 'text') && (
          <p id={`text-error`} className='text-xs text-red-500 font-medium'>
            {errors.find(err => err.code === 'text')?.message}
          </p>
        )}
      </div>

      <button
        type='submit'
        disabled={!tweetValid || isLoading}
        className='bg-blue hover:bg-blue/90 active:bg-blue/80 disabled:opacity-50 disabled:hover:bg-blue disabled:active:bg-blue text-white rounded-full py-2 px-4 font-bold text-sm self-end'
      >
        Tweeter
      </button>
    </form>
  )
}

export default PostReply
