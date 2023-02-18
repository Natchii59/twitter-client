import { createRef, useEffect, useState } from 'react'
import { useCreateTweetMutation } from '../stores/authApiSlice'
import { ErrorMessage } from '../utils/types'
import Spinner from './Spinner'
import CircleLength from './CircleLength'

interface PostTweetProps {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
}

function PostTweet({ setRefresh }: PostTweetProps) {
  const [tweet, setTweet] = useState<string>('')
  const [tweetValid, setTweetValid] = useState<boolean>(false)
  const [errors, setErrors] = useState<ErrorMessage[]>([])

  const textAreaRef = createRef<HTMLTextAreaElement>()

  const [createTweet, { isLoading }] = useCreateTweetMutation()

  const updateTweet = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value)
    setErrors(prev => prev.filter(err => err.code !== 'text'))
  }

  const submitHandle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { data, errors } = await createTweet({ text: tweet.trim() }).unwrap()

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
    <div className='border-b border-zinc-800 pb-2 border-l border-r'>
      <div className='flex items-start gap-2 p-4'>
        <img
          className='h-12 w-12 rounded-full'
          src='/default_pfp.jpeg'
          alt='Profile'
        />

        <form className='flex-1' onSubmit={submitHandle}>
          <div className='mb-2'>
            <textarea
              ref={textAreaRef}
              className={`text-white placeholder-zinc-500 text-xl rounded-lg w-full bg-transparent focus:outline-none resize-none p-1 ${
                errors.find(err => err.code === 'text')
                  ? 'border border-red-500'
                  : 'border border-transparent'
              }`}
              placeholder='Quoi de neuf ?'
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

          <div className='flex w-full'>
            <div className='flex-1' />

            <div className='flex items-center gap-3'>
              {isLoading && <Spinner size={20} />}

              {tweet.length > 0 && (
                <CircleLength size={24} max={280} value={tweet.length} />
              )}

              <button
                type='submit'
                disabled={!tweetValid}
                className='bg-blue hover:bg-blue/90 active:bg-blue/80 disabled:opacity-50 disabled:hover:bg-blue disabled:active:bg-blue text-white rounded-full py-2 px-4 font-bold text-sm'
              >
                Tweeter
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PostTweet
