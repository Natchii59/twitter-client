export interface ErrorMessage {
  message?: string
  code: string
}

export interface ErrorOutput {
  statusCode: number
  message: string | ErrorMessage[]
  error?: string
}

export interface User {
  id: string
  username: string
  email: string
  name: string
  birthday: Date
  createdAt: Date
  updatedAt: Date
  following: User[]
  followers: User[]
}

export interface Tweet {
  id: string
  text: string
  createdAt: Date
  likes: User[]
  user: User
}

// Login
export interface LoginInput {
  email: string
  password: string
}

export interface LoginOutput {
  errors: ErrorOutput[] | null
  data: {
    SignIn: {
      accessToken: string
      refreshToken: string
      user: User
    }
  } | null
}

// Authenticate
export interface AuthenticateOutput {
  errors: ErrorOutput[] | null
  data: {
    Profile: User
  }
}

// Refresh Tokens
export interface RefreshTokensOutput {
  errors: ErrorOutput[] | null
  data: {
    RefreshTokens: {
      accessToken: string
      refreshToken: string
    }
  }
}

// Find One User
export interface FindOneUserOutput {
  errors: ErrorOutput[] | null
  data: {
    FindOneUser: User
  }
}

// Sign Up
export interface SignUpInput {
  name: string
  email: string
  username: string
  password: string
  birthday: Date
}

export interface SignUpOutput {
  errors: ErrorOutput[] | null
  data: {
    SignUp: {
      accessToken: string
      refreshToken: string
      user: User
    }
  }
}

// Pagination Tweet
export interface PaginationTweet {
  errors: ErrorOutput[] | null
  data: {
    PaginationTweet: {
      totalCount: number
      nodes: Tweet[]
    }
  }
}

// Create Tweet
export interface CreateTweetInput {
  text: string
}

export interface CreateTweetOutput {
  errors: ErrorOutput[] | null
  data: {
    CreateTweet: Tweet
  }
}

// Like Tweet
export interface LikeTweetInput {
  id: string
}

export interface LikeTweetOutput {
  errors: ErrorOutput[] | null
  data: {
    LikeTweet: Tweet
  }
}

// Follow User
export interface FollowUserInput {
  id: string
}

export interface FollowUserOutput {
  errors: ErrorOutput[] | null
  data: {
    FollowUser: User
  }
}
