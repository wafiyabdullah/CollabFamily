import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation
} from "react-router-dom"
import {Toaster} from 'sonner'
import { useSelector, useDispatch } from 'react-redux'
import { setOpenSidebar } from "./redux/slices/authSlice"
import { useRef, Fragment } from "react"
import clsx from "clsx"
import { Transition } from "@headlessui/react"
import { IoClose } from "react-icons/io5";

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Task from './pages/Task'
import Users from './pages/Users'
import Bill from './pages/Bill'
import TaskDetails from './pages/TaskDetails'
import BillDetails from './pages/BillDetails'
import Admin from './pages/Admin'
import RoleBasedRedirect from './pages/RoleBasedRedirect'
import Layout from './pages/Layout'

// App component routes
function App() {
  return(
    <main className='w-full min-h-screen bg-[#f3f4f6]'>
      <Routes>
        <Route path="/" element={<RoleBasedRedirect />} />
        <Route element={<Layout />}>
          {/* Admin-specific route */}
          <Route path='/admin/*' element={<Admin />} />
          
          <Route path='/dashboard/*' element={<Dashboard />}/>

          <Route path='/tasks' element={<Task />} />
          
          <Route path='/bill' element={<Bill />} />

          <Route path='/family' element={<Users />} />

          <Route path='/task/:id' element={<TaskDetails/>} />

          <Route path='/bill/:id' element={<BillDetails/>} />
          
        </Route>

        <Route path='/login' element={<Login />} />
      </Routes>

      <Toaster position="top-center" richColors closeButton expand={true}/>
    </main>
  )
}

export default App
