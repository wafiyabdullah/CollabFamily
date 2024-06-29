import React from 'react'
import {Menu, Transition} from "@headlessui/react"
import { Fragment, useState } from 'react'
import {FaUser, FaUserLock} from "react-icons/fa"
import {IoLogOutOutline} from "react-icons/io5"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getInitials } from '../utils/index'
import { toast } from 'sonner'
import { useLogoutMutation } from '../redux/slices/api/authApiSlice'
import { logout } from '../redux/slices/authSlice'
import Profile from './Profile'
import ChangePassword from './ChangePassword'

const UserAvatar = () => {
    const [open, setOpen] = useState(false); //state for open
    const [openPassword, setOpenPassword] = useState(false); //state for open password

    const { user } = useSelector((state) => state.auth); //useSelector to get user from redux for auth
    const dispatch = useDispatch(); //useDispatch to dispatch actions
    const navigate = useNavigate(); //useNavigate to navigate to dashboard

    const [logoutUser] = useLogoutMutation(); //logout mutation
    

    const logoutHandler = async () => { //logout handler
        try{
            await logoutUser().unwrap(); //logout user
            dispatch(logout()); //dispatch logout
            window.location.reload(); //reload window
            navigate('/login'); //navigate to login

        } catch (error) {
            toast.error("something went wrong")
            console.log(error);
        }
    }

  return <>
    <div>
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="w-10 h-10 2xl:w-12 2xl:h-12 items-center justify-center rounded-full bg-blue-700">
                    <span className='text-white font-semibold'> 
                        {getInitials(user?.username)} {/* getInitials from utils */}
                    </span>
                </Menu.Button>
            </div>

            <Transition
                as={Fragment} //transition for menu items
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
                >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-gray-100 bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none">
                    <div className='p-4'>
                        <Menu.Item>
                            {({active}) => ( //profile button
                                <button onClick={() => setOpen(true)}  //open profile
                                className='text-gray-700 group flex w-full items-center rounded-md px-2 py-2 text-base'
                                >
                                    <FaUser className='mr-2' aria-hidden='true'/>
                                    Profile
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => ( //change password button
                                <button
                                onClick={() => setOpenPassword(true)} //open password
                                className={`text-gray-400 group flex w-full items-center rounded-md px-2 py-2 text-base`}
                                >
                                    <FaUserLock className='mr-2' aria-hidden='true' />
                                    Change Password
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                        {({ active }) => ( //logout button
                            <button
                            onClick={logoutHandler} //logout handler
                            className={`text-red-600 group flex w-full items-center rounded-md px-2 py-2 text-base`}
                            >
                                <IoLogOutOutline className='mr-2' aria-hidden='true' />
                                Logout
                            </button>
                        )}
                        </Menu.Item>        
                    </div>
                </Menu.Items>
            </Transition>
          
        </Menu>

        {/* Profile Modal */}
        <Profile open={open} setOpen={setOpen}/>

        {/* Change Password Modal */}
        <ChangePassword open={openPassword} setOpen={setOpenPassword}/>
    </div>
  </>
  
}

export default UserAvatar