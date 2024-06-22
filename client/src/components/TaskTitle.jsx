import React from 'react'
import { IoMdAdd } from 'react-icons/io'
import clsx from 'clsx'

const TaskTitle = ({label, className}) => {
  return (
    <div className='w-full h-10 md:h-12 px-2 md:px-4 rounded bg-white flex items-center justify-between'>
        <div className='flex gap-2 items-center'>
            <div className={clsx("w-4 h-4 rounded-full", className)}></div>
            <p className='text-sm md:text-base text-gray-600'>{label}</p>
        </div>
        <button className='hidden md:block'>
            <IoMdAdd className='text-black text-lg' />
        </button>
    </div>
  )
}

export default TaskTitle