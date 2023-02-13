import { InputHTMLAttributes, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

import { ErrorMessage } from '../utils/types'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

interface InputFormProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  loading?: boolean
  success?: boolean
  error?: ErrorMessage
}

function InputForm({
  name,
  label,
  loading,
  success,
  error,
  ...rest
}: InputFormProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  return (
    <div>
      <div className='relative'>
        <input
          {...rest}
          type={showPassword ? 'text' : rest.type}
          id={name}
          aria-describedby={`${name}-error`}
          className={`block px-2.5 pb-2.5 pt-4 w-full text-base bg-transparent rounded-lg border-1 appearance-none text-zinc-100 border focus:outline-none focus:ring-0 peer disabled:cursor-not-allowed focus:invalid:border-red-500 disabled:opacity-70 ${
            error
              ? 'border-red-500 focus:border-red-500'
              : success
              ? 'border-green-500 focus:border-green-500'
              : 'border-zinc-400 focus:border-blue'
          } ${(loading || rest.type === 'password') && 'pr-12'} ${
            rest.maxLength && 'pr-20'
          }`}
          placeholder=' '
        />

        <label
          htmlFor={name}
          className={`absolute text-base duration-300 transform -translate-y-5 scale-75 top-2 origin-[0] bg-black px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:cursor-text peer-disabled:cursor-not-allowed peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 left-1 peer-focus:peer-invalid:text-red-500 peer-disabled:opacity-70 ${
            error
              ? 'text-red-500'
              : success
              ? 'text-green-500'
              : 'peer-focus:text-blue text-gray-400'
          }`}
        >
          {label}
        </label>

        {loading && (
          <div
            role='status'
            className='absolute right-3 top-1/2 transform -translate-y-1/2'
          >
            <svg
              aria-hidden='true'
              className='w-6 h-6 text-gray-400 animate-spin fill-blue'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='currentColor'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='currentFill'
              />
            </svg>
            <span className='sr-only'>Loading...</span>
          </div>
        )}

        {rest.maxLength && rest.type === 'text' && (
          <p className='absolute right-3 top-1/2 transform -translate-y-1/2 text-base text-gray-400'>
            {(rest.value as string).length || 0}/{rest.maxLength}
          </p>
        )}

        {rest.type === 'password' && (
          <button
            type='button'
            className='absolute right-3 top-1/2 transform -translate-y-1/2'
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <FaEyeSlash className='w-5 h-5 text-gray-400' />
            ) : (
              <FaEye className='w-5 h-5 text-gray-400' />
            )}
          </button>
        )}
      </div>

      {!!error && error.message && (
        <p
          id={`${name}-error`}
          className='mt-2 text-xs text-red-500 font-medium'
        >
          {error.message}
        </p>
      )}
    </div>
  )
}

export default InputForm
