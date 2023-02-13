import { Route, Routes } from 'react-router-dom'
import SignIn from './pages/SignIn'
import AuthenticatedRoute from './components/RequireAuth'
import Home from './pages/Home'
import RequireAuth from './components/RequireAuth'
import SignUp from './pages/SignUp'

function App() {
  return (
    <Routes>
      <Route path='sign-in' element={<SignIn />} />
      <Route path='sign-up' element={<SignUp />} />

      <Route path='/' element={<RequireAuth />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  )
}

export default App
