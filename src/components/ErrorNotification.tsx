import { ErrorMessage } from '../utils/types'
import { useEffect } from 'react'

interface ErrorNotificationProps {
  errors: ErrorMessage[]
  setErrors: React.Dispatch<React.SetStateAction<ErrorMessage[]>>
}

function ErrorNotification({ errors, setErrors }: ErrorNotificationProps) {
  useEffect(() => {
    let timer: number

    if (errors.length) {
      timer = setTimeout(() => {
        setErrors([])
      }, 5000)
    }

    return () => clearTimeout(timer)
  }, [errors])

  if (!errors.length) return null

  return (
    <div className='fixed right-4 top-1 z-50 px-4'>
      <div className='bg-red-600 px-4 py-1 rounded-xl flex flex-col items-start gap-1'>
        <p className='text-lg font-semibold mb-1'>Une erreur est survenue:</p>

        {errors.map((err, i) => (
          <p key={`${err.code}-${i}`} className='text-sm font-medium'>
            {err.message}
          </p>
        ))}
      </div>
    </div>
  )
}

export default ErrorNotification
