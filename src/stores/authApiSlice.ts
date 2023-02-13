import { apiSlice } from '../api/apiSlice'
import {
  AuthenticateOutput,
  LoginInput,
  LoginOutput,
  SignUpInput,
  SignUpOutput
} from '../utils/types'

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<LoginOutput, LoginInput>({
      query: payload => ({
        url: '',
        body: {
          query: `
            mutation($email: String!, $password: String!) {
              SignIn(email: $email, password: $password) {
                accessToken
                refreshToken
                user {
                  id
                  username
                  email
                  name
                  birthday
                  createdAt
                }
              }
            }
          `,
          variables: payload
        }
      })
    }),
    authenticate: builder.query<AuthenticateOutput, void>({
      query: () => ({
        url: '',
        body: {
          query: `
            query {
              Profile {
                id
                username
                email
                name
                birthday
                createdAt
              }
            }
          `
        }
      })
    }),
    signup: builder.mutation<SignUpOutput, SignUpInput>({
      query: payload => ({
        url: '',
        body: {
          query: `
            mutation($input: CreateUserInput!) {
              SignUp(input: $input) {
                accessToken
                refreshToken
                user {
                  id
                  username
                  email
                  name
                  birthday
                  createdAt
                }
              }
            }
          `,
          variables: {
            input: payload
          }
        }
      })
    })
  })
})

export const { useLoginMutation, useAuthenticateQuery, useSignupMutation } =
  authApiSlice
