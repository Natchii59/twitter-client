import { apiSlice } from '../api/apiSlice'
import {
  AuthenticateOutput,
  CreateTweetInput,
  CreateTweetOutput,
  LikeTweetInput,
  LikeTweetOutput,
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
    }),
    createTweet: builder.mutation<CreateTweetOutput, CreateTweetInput>({
      query: payload => ({
        url: '',
        body: {
          query: `
            mutation($input: CreateTweetInput!) {
              CreateTweet(input: $input) {
                id
                text
                createdAt
                user {
                  id
                  username
                }
              }
            }
          `,
          variables: {
            input: payload
          }
        }
      })
    }),
    likeTweet: builder.mutation<LikeTweetOutput, LikeTweetInput>({
      query: payload => ({
        url: '',
        body: {
          query: `
            mutation($id: ID!) {
              LikeTweet(id: $id) {
                id
              }
            }
          `,
          variables: payload
        }
      })
    })
  })
})

export const {
  useLoginMutation,
  useAuthenticateQuery,
  useSignupMutation,
  useCreateTweetMutation,
  useLikeTweetMutation
} = authApiSlice
