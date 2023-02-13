import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '.'
import { User } from '../utils/types'

export interface AuthState {
  user: User | null
}

const initialState: AuthState = {
  user: null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    logOut: state => {
      state.user = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }
})

export const { setUser, logOut } = authSlice.actions
export default authSlice.reducer

export const selectUser = (state: RootState) => state.auth.user
