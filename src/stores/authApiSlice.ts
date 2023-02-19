import { apiSlice } from '../api/apiSlice'
import {
  AuthenticateOutput,
  CreateTweetInput,
  CreateTweetOutput,
  DeleteTweetInput,
  DeleteTweetOutput,
  FollowUserInput,
  FollowUserOutput,
  LikeTweetInput,
  LikeTweetOutput,
  LoginInput,
  LoginOutput,
  ReplyTweetInput,
  ReplyTweetOutput,
  RetweetTweetInput,
  RetweetTweetOutput,
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
                  followers {
                    id
                  }
                  following {
                    id
                  }
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
                followers {
                  id
                }
                following {
                  id
                }
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
    }),
    followUser: builder.mutation<FollowUserOutput, FollowUserInput>({
      query: payload => ({
        url: '',
        body: {
          query: `
            mutation($id: ID!) {
              FollowUser(id: $id) {
                id
                username
                name
                createdAt
                birthday
                followers {
                  id
                }
                following {
                  id
                }
              }
            }
          `,
          variables: payload
        }
      })
    }),
    retweetTweet: builder.mutation<RetweetTweetOutput, RetweetTweetInput>({
      query: payload => ({
        url: '',
        body: {
          query: `
            mutation($id: ID!) {
              Retweet(id: $id) {
                id
              }
            }
          `,
          variables: payload
        }
      })
    }),
    deleteTweet: builder.mutation<DeleteTweetOutput, DeleteTweetInput>({
      query: payload => ({
        url: '',
        body: {
          query: `
            mutation($id: ID!) {
              DeleteTweet(id: $id)
            }
          `,
          variables: payload
        }
      })
    }),
    replyTweet: builder.mutation<ReplyTweetOutput, ReplyTweetInput>({
      query: payload => ({
        url: '',
        body: {
          query: `
            mutation($input: ReplyTweetInput!) {
              ReplyTweet(input: $input) {
                id
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

export const {
  useLoginMutation,
  useAuthenticateQuery,
  useSignupMutation,
  useCreateTweetMutation,
  useLikeTweetMutation,
  useFollowUserMutation,
  useRetweetTweetMutation,
  useDeleteTweetMutation,
  useReplyTweetMutation
} = authApiSlice
