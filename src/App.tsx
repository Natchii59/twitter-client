import { Route, Routes } from 'react-router-dom'

import SignIn from './pages/SignIn'
import Home from './pages/Home'
import RequireAuth from './components/RequireAuth'
import SignUp from './pages/SignUp'
import Layout from './components/Layout'
import Profile from './pages/Profile'
import TweetPage from './pages/Tweet'

function App() {
  return (
    <Routes>
      <Route path='/' element={<RequireAuth />}>
        <Route path='sign-in' element={<SignIn />} />
        <Route path='sign-up' element={<SignUp />} />

        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='profile/:username' element={<Profile />} />
          <Route path='tweet/:id' element={<TweetPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
