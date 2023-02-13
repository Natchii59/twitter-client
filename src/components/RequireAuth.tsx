import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthenticateQuery } from '../stores/authApiSlice'
import { AppDispatch } from '../stores'
import { setUser } from '../stores/authSlice'

function RequireAuth() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const { data, isLoading } = useAuthenticateQuery()

  useEffect(() => {
    if (!data?.data && data?.errors) {
      navigate('/sign-in', { state: { from: location } })
    } else {
      dispatch(setUser(data?.data.Profile))
    }
  }, [data])

  if (isLoading) return <div />

  if (data) return <Outlet />
  return <Navigate to='/sign-in' state={{ from: location }} replace />
}

export default RequireAuth
