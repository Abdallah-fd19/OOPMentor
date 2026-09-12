import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/auth/ProtectedRoute'
import GuestRoute from './components/auth/GuestRoute'
import Exercises from './pages/Exercises'
import Exercise from './pages/Exercise'


export default function App(){
 return (
  <Routes>
    <Route path='/' element={<Navigate to={"/login"} replace/>}></Route>
    <Route path='/login' element={<GuestRoute><Login/></GuestRoute>}></Route>
    <Route path='/register' element={<GuestRoute><Register/></GuestRoute>}></Route>
    <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}></Route>
    <Route path='/module/:moduleNumber/exercises' element={<ProtectedRoute><Exercises/></ProtectedRoute>}></Route>
    <Route path='/exercise/:exerciseNumber' element={<ProtectedRoute><Exercise/></ProtectedRoute>}></Route>
  </Routes>
 )
}