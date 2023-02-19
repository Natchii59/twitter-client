import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import AuthLayout from '../components/AuthLayout'
import { selectUser, setUser } from '../stores/authSlice'
import { AppDispatch } from '../stores'
import { useLoginMutation } from '../stores/authApiSlice'
import InputForm from '../components/InputForm'
import { ErrorMessage } from '../utils/types'

function SignIn() {
  const navigate = useNavigate()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errors, setErrors] = useState<ErrorMessage[]>([])

  const [login, { isLoading }] = useLoginMutation()
  const dispatch = useDispatch<AppDispatch>()
  const currentUser = useSelector(selectUser)

  const updateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setErrors(err => err.filter(e => e.code !== 'email'))
  }

  const updatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setErrors(err => err.filter(e => e.code !== 'password'))
  }

  useEffect(() => {
    if (currentUser) navigate('/')
  }, [currentUser])

  const submitHandle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { data, errors } = await login({ email, password }).unwrap()

    if (errors) {
      if ([400, 401].includes(errors[0].statusCode)) {
        setPassword('')

        const messages = errors[0].message
        if (Array.isArray(messages)) {
          setErrors(messages)
        } else {
          setErrors([{ message: messages, code: '' }])
        }
      }
    } else if (data) {
      dispatch(setUser(data.SignIn.user))
      localStorage.setItem('accessToken', data.SignIn.accessToken)
      localStorage.setItem('refreshToken', data.SignIn.refreshToken)

      navigate('/')
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={submitHandle}>
        <h1 className='text-3xl font-semibold py-2'>
          Connectez-vous à Twitter
        </h1>

        {errors.length > 0 && (
          <p
            className='text-red-500 text-lg font-semibold'
            role='alert'
            aria-label='Invalid credentials'
          >
            Identifiants incorrects
          </p>
        )}

        <div className='py-3'>
          <InputForm
            name='email'
            label='Adresse mail'
            type='text'
            required
            pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'
            aria-label='Email'
            value={email}
            onChange={updateEmail}
            disabled={isLoading}
            error={errors.find(e => e.code === 'email')}
          />
        </div>

        <div className='py-3'>
          <InputForm
            name='password'
            label='Mot de passe'
            type='password'
            required
            aria-label='Password'
            value={password}
            onChange={updatePassword}
            disabled={isLoading}
            error={errors.find(e => e.code === 'password')}
          />
        </div>

        <button
          className='w-full bg-blue rounded-full py-3 text-xl font-semibold mb-2 mt-6'
          type='submit'
          aria-label='Sign in'
          disabled={isLoading}
        >
          Se connecter
        </button>

        <p className='text-center text-sm mt-2'>
          Vous n&apos;avez pas de compte ?{' '}
          <Link to='/sign-up' className='text-blue hover:underline'>
            Inscrivez-vous
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default SignIn
