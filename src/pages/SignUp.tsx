import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import moment from 'moment'
import debounce from 'lodash/debounce'

import AuthLayout from '../components/AuthLayout'
import { AppDispatch } from '../stores'
import InputForm from '../components/InputForm'
import SelectForm from '../components/SelectForm'
import { ErrorMessage, FindOneUserOutput } from '../utils/types'
import { useSignupMutation } from '../stores/authApiSlice'
import { selectUser, setUser } from '../stores/authSlice'

function SignUp() {
  const navigate = useNavigate()

  const actualYear = parseInt(moment().format('YYYY'))

  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [day, setDay] = useState<number>(parseInt(moment().format('DD')))
  const [month, setMonth] = useState<number>(parseInt(moment().format('MM')))
  const [year, setYear] = useState<number>(actualYear)

  const [fetchControllerEmail, setFetchControllerEmail] =
    useState<AbortController | null>(null)
  const [fetchControllerUsername, setFetchControllerUsername] =
    useState<AbortController | null>(null)
  const [loadingEmail, setLoadingEmail] = useState<boolean>(false)
  const [loadingUsername, setLoadingUsername] = useState<boolean>(false)

  const [errors, setErrors] = useState<ErrorMessage[]>([])

  const [signup, { isLoading }] = useSignupMutation()
  const dispatch = useDispatch<AppDispatch>()
  const currentUser = useSelector(selectUser)

  useEffect(() => {
    if (currentUser) navigate('/')
  }, [currentUser])

  const updateName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    setErrors(err => err.filter(e => e.code !== 'names'))
  }

  const updateEmail = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailTarget = e.target.value.toLowerCase()
    setEmail(emailTarget)

    if (e.target.validity.valid) {
      await checkEmail.current(emailTarget)
    }
  }

  const checkEmail = useRef(
    debounce(async emailTarget => {
      setLoadingEmail(true)

      if (fetchControllerEmail && fetchControllerEmail.signal.aborted)
        fetchControllerEmail.abort()

      const fetchControllerEmailTmp = new AbortController()
      setFetchControllerEmail(fetchControllerEmailTmp)

      const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/graphql`, {
        signal: fetchControllerEmailTmp.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
          query($input: FindOneUserInput!) {
            FindOneUser(input: $input) {
              id
            }
          }
        `,
          variables: {
            input: {
              email: emailTarget
            }
          }
        })
      })

      const data = (await res.json()) as FindOneUserOutput

      setLoadingEmail(false)

      if (data.data.FindOneUser) {
        setErrors(err => [
          ...err,
          {
            code: 'email',
            message: 'Cette adresse mail est déjà utilisée'
          }
        ])
      } else {
        setErrors(err => err.filter(e => e.code !== 'email'))
      }
    }, 1000)
  )

  const updateUsername = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const usernameTarget = e.target.value.toLowerCase()
    setUsername(usernameTarget)

    if (e.target.validity.valid) {
      await checkUsername.current(usernameTarget)
    }
  }

  const checkUsername = useRef(
    debounce(async usernameTarget => {
      setLoadingUsername(true)

      if (fetchControllerUsername) fetchControllerUsername.abort()

      const fetchControllerUsernameTmp = new AbortController()
      setFetchControllerUsername(fetchControllerUsernameTmp)

      const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/graphql`, {
        signal: fetchControllerUsernameTmp.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
          query($input: FindOneUserInput!) {
            FindOneUser(input: $input) {
              id
            }
          }
        `,
          variables: {
            input: {
              username: usernameTarget
            }
          }
        })
      })

      const data = (await res.json()) as FindOneUserOutput

      setLoadingUsername(false)

      if (data.data.FindOneUser) {
        setErrors(err => [
          ...err,
          {
            code: 'username',
            message: "Ce nom d'utilisateur est déjà utilisé"
          }
        ])
      } else {
        setErrors(err => err.filter(e => e.code !== 'username'))
      }
    }, 1000)
  )

  const updatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordTarget = e.target.value.replaceAll(/\s/g, '')
    setPassword(passwordTarget)
    setErrors(err => err.filter(e => e.code !== 'password'))
  }

  const updateDay = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDay(Number(e.target.value))
    setErrors(err => err.filter(e => e.code !== 'day'))
  }

  const updateMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(Number(e.target.value))
    setErrors(err => err.filter(e => e.code !== 'month'))
  }

  const updateYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(Number(e.target.value))
    setErrors(err => err.filter(e => e.code !== 'year'))
  }

  const submitHandle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const birthday = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD').toDate()

    const { data, errors } = await signup({
      name,
      email,
      username,
      password,
      birthday
    }).unwrap()

    if (errors) {
      if ([400].includes(errors[0].statusCode)) {
        setPassword('')

        const messages = errors[0].message
        if (Array.isArray(messages)) {
          setErrors(messages)
        } else {
          setErrors([{ message: messages, code: '' }])
        }
      }
    } else if (data) {
      dispatch(setUser(data.SignUp.user))
      localStorage.setItem('accessToken', data.SignUp.accessToken)
      localStorage.setItem('refreshToken', data.SignUp.refreshToken)

      navigate('/')
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={submitHandle}>
        <h1 className='text-3xl font-semibold pt-2 pb-8'>
          Créez votre compte Twitter
        </h1>

        <div className='pb-4'>
          <InputForm
            name='name'
            label='Nom et prénom'
            type='text'
            required
            aria-label='Name'
            autoComplete='name'
            maxLength={50}
            value={name}
            onChange={updateName}
            error={errors.find(e => e.code === 'name')}
            disabled={isLoading}
          />
        </div>

        <div className='pb-4'>
          <InputForm
            name='email'
            label='Adresse mail'
            type='text'
            required
            pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'
            aria-label='Email'
            autoComplete='email'
            value={email}
            onChange={updateEmail}
            loading={loadingEmail}
            error={errors.find(e => e.code === 'email')}
            disabled={isLoading}
          />
        </div>

        <div className='pb-4'>
          <InputForm
            name='username'
            label="Nom d'utilisateur"
            type='text'
            required
            pattern='^[a-zA-Z0-9_]{3,}$'
            aria-label='Username'
            autoComplete='username'
            value={username}
            onChange={updateUsername}
            loading={loadingUsername}
            error={errors.find(e => e.code === 'username')}
            disabled={isLoading}
          />
        </div>

        <div className='pb-4'>
          <InputForm
            name='password'
            label='Mot de passe'
            type='password'
            required
            pattern='^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$'
            aria-label='Password'
            autoComplete='new-password'
            value={password}
            onChange={updatePassword}
            error={errors.find(e => e.code === 'password')}
            disabled={isLoading}
          />
        </div>

        <div className='my-4'>
          <p className='pb-4 text-xl font-semibold'>Date de naissance</p>

          <div
            className='flex items-center gap-4'
            aria-describedby='birthday-error'
          >
            <div className='flex-1'>
              <SelectForm
                label='Jour'
                name='day'
                required
                onChange={updateDay}
                defaultValue={day}
                disabled={isLoading}
              >
                {Array.from(
                  {
                    length: moment(`${year}-${month}`, 'YYYY-MM').daysInMonth()
                  },
                  (_, i) => i + 1
                ).map(d => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </SelectForm>
            </div>

            <div className='flex-1'>
              <SelectForm
                label='Mois'
                name='month'
                required
                onChange={updateMonth}
                defaultValue={month}
                disabled={isLoading}
              >
                {moment.months().map((m, index) => (
                  <option key={index} value={index + 1}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </option>
                ))}
              </SelectForm>
            </div>

            <div className='flex-1'>
              <SelectForm
                label='Année'
                name='year'
                required
                onChange={updateYear}
                defaultValue={year}
                disabled={isLoading}
              >
                {Array.from(
                  {
                    length: 100
                  },
                  (_, i) => actualYear - 100 + i + 1
                ).map(y => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </SelectForm>
            </div>
          </div>

          {errors.find(e => e.code === 'birthday') && (
            <p
              id={`birthday-error`}
              className='mt-2 text-xs text-red-500 font-medium'
            >
              {errors.find(e => e.code === 'birthday')?.message}
            </p>
          )}
        </div>

        <button
          type='submit'
          className='w-full py-3 text-lg font-semibold bg-blue rounded-full mt-6 mb-2'
        >
          S&apos;inscrire
        </button>

        <p className='text-center text-sm mt-2'>
          Vous avez déjà un compte ?{' '}
          <Link to='/sign-in' className='text-blue hover:underline'>
            Connectez-vous
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default SignUp
