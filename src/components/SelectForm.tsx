import { SelectHTMLAttributes } from 'react'
import { FaAngleDown } from 'react-icons/fa'
import { ErrorMessage } from '../utils/types'

interface SelectFormProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string
  label: string
  defaultEmpty?: boolean
  error?: ErrorMessage
  children: React.ReactNode
}

function SelectForm({
  name,
  label,
  defaultEmpty,
  error,
  children,
  ...rest
}: SelectFormProps) {
  return (
    <div>
      <div className='relative'>
        <select
          id={name}
          aria-describedby={`${name}-error`}
          className={`block px-2.5 pb-2.5 pt-4 w-full text-base bg-transparent rounded-lg border-1 appearance-none text-zinc-100 border  focus:border-blue-500 focus:outline-none focus:ring-0 peer disabled:cursor-not-allowed hover:cursor-pointer focus:invalid:border-red-500 ${
            error ? 'border-red-500' : 'border-zinc-400'
          }`}
          placeholder=' '
          defaultValue={defaultEmpty ? 'DEFAULT_VALUE_OPTION' : undefined}
          {...rest}
        >
          {defaultEmpty && (
            <option value='DEFAULT_VALUE_OPTION' disabled></option>
          )}
          {children}
        </select>
        <label
          htmlFor={name}
          className={`absolute text-base duration-300 transform -translate-y-5 scale-75 top-2 origin-[0] bg-black px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:cursor-text peer-disabled:cursor-not-allowed peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 left-1 peer-focus:peer-invalid:text-red-500 ${
            error ? 'text-red-500' : 'peer-focus:text-blue-500 text-gray-400'
          }`}
        >
          {label}
        </label>
        <FaAngleDown className='absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:cursor-pointer' />
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

export default SelectForm
