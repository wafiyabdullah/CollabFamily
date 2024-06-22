import React from 'react'
import { setOpenSidebar } from '../redux/slices/authSlice'

import { useDispatch, useSelector } from 'react-redux'
import UserAvatar from '../components/UserAvatar'
import { MdOutlineSearch } from "react-icons/md";

const Navbar = () => {
    const {user} = useSelector((state) => state.auth); //useSelector to get user from redux for auth
    const dispatch = useDispatch(); //useDispatch to dispatch actions


  return (
    <div className='flex justify-between items-center bg-white px-4 py-3 2xl:py-2 sticky z-10 top-0'>
        <div className='flex gap-4'>
            <button 
            onClick={()=> dispatch(setOpenSidebar(true))} //open sidebar
            className='text-2xl text-gray-500 block md:hidden'>☰</button> 
        {/* search bar*/}
        <div className='w-64 2xl:w-[500px] flex items-center py-2 px-3 gap-2 rounded bg-[#f3f4f6]'>
          <MdOutlineSearch className='text-gray-500 text-xl '/>
          <input type='text' placeholder='Search' className='flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800'/>
        </div>
        </div>

        <div className='flex gap-2 items-center'>
            {/* <NotificationPanel /> {/*notification panel*/} 
            {user?.username}
            <UserAvatar /> {/*user avatar*/}
            
        </div>
    </div>
  )
}
 
export default Navbar
