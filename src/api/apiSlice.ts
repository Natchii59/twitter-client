import {
  BaseQueryApi,
  FetchArgs,
  createApi,
  fetchBaseQuery
} from '@reduxjs/toolkit/query/react'
import { ErrorOutput, RefreshTokensOutput } from '../utils/types'
import { logOut } from '../stores/authSlice'

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3001/graphql',
  method: 'POST',
  prepareHeaders: headers => {
    headers.append('Content-Type', 'application/json')

    const accessToken = localStorage.getItem('accessToken')

    if (accessToken && !headers.has('Authorization')) {
      headers.append('Authorization', `Bearer ${accessToken}`)
    }

    return headers
  }
})

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {}
) => {
  let result = await baseQuery(args, api, extraOptions)

  const errors = (result.data as any).errors as ErrorOutput[]

  const status = errors ? errors[0].statusCode : null

  if (status === 401) {
    const refreshToken = localStorage.getItem('refreshToken')

    const refreshResult = await baseQuery(
      {
        url: '',
        body: {
          query: `
            query {
              RefreshTokens {
                accessToken
                refreshToken
              }
            }
          `
        },
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      },
      api,
      extraOptions
    )

    const refreshData = refreshResult.data as RefreshTokensOutput

    if (refreshData.data) {
      const { accessToken, refreshToken: newRefreshToken } =
        refreshData.data.RefreshTokens

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', newRefreshToken)

      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(logOut())
    }
  }

  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({})
})
