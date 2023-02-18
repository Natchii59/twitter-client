import { Dialog } from '@headlessui/react'
import { createRef, useEffect, useState } from 'react'
import Spinner from './Spinner'
import { useCreateTweetMutation } from '../stores/authApiSlice'
import { ErrorMessage } from '../utils/types'
import { useNavigate } from 'react-router-dom'
import CircleLength from './CircleLength'

interface ComposeTweetModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function ComposeTweetModal({ isOpen, setIsOpen }: ComposeTweetModalProps) {
  const navigate = useNavigate()

  const [tweet, setTweet] = useState<string>('')
  const [tweetValid, setTweetValid] = useState<boolean>(false)
  const [errors, setErrors] = useState<ErrorMessage[]>([])

  const textAreaRef = createRef<HTMLTextAreaElement>()

  const [createTweet, { isLoading }] = useCreateTweetMutation()

  const updateTweet = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value)
    setErrors(prev => prev.filter(err => err.code !== 'text'))
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
      setIsOpen(false)
      navigate(`/tweet/${data.CreateTweet.id}`)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className='relative z-50'
    >
      <div className='fixed inset-0 bg-zinc-300/20' aria-hidden='true' />

      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='mx-auto max-w-lg w-full rounded-xl bg-black p-4'>
          <button
            onClick={() => setIsOpen(false)}
            className='p-2 rounded-full hover:bg-zinc-900 active:bg-zinc-900/90 outline-none focus:bg-zinc-900'
          >
            <svg viewBox='0 0 24 24' fill='currentColor' className='w-5 h-5'>
              <g>
                <path d='M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z'></path>
              </g>
            </svg>
          </button>

          <div className='flex items-start gap-2 py-2'>
            <img
              className='h-12 w-12 rounded-full'
              src='/default_pfp.jpeg'
              alt='Profile'
            />

            <form className='flex-1' onSubmit={submitHandle}>
              <div className='mb-2'>
                <textarea
                  ref={textAreaRef}
                  className={`text-white placeholder-zinc-500 text-xl h-9 rounded-lg bg-transparent w-full focus:outline-none resize-none p-1 ${
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
                  <p
                    id={`text-error`}
                    className='text-xs text-red-500 font-medium'
                  >
                    {errors.find(err => err.code === 'text')?.message}
                  </p>
                )}
              </div>

              <div className='flex w-full border-t border-zinc-800 pt-4'>
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
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default ComposeTweetModal
