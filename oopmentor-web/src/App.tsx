import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'


export default function App(){
 return (
  <Routes>
    <Route path='/' element={<Navigate to={"/login"} replace/>}></Route>
    <Route path='/login' element={<Login/>}></Route>
    <Route path='/register' element={<Register/>}></Route>
    <Route path='/dashboard' element={<Dashboard/>}></Route>
  </Routes>
 )
}