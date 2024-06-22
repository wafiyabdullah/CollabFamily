import React from 'react'
import { getInitials } from '../utils'
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";

const UserInfo = ({user}) => {
  return (
    <div className='p-1'>
        <span>{user?.name}</span> 
    </div>
  )
}

export default UserInfo