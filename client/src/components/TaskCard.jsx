import React from 'react'
import clsx from 'clsx'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { getInitials } from "../utils";
import { useNavigate } from 'react-router-dom';

import TaskDialog from '../components/task/TaskDialog'
import { formatDate } from '../utils'
import { PRIORITY_STYLE, TASK_TYPE, PRIORITY_AFTER, TASK_AFTER } from '../utils'

const TaskCard = ({task}) => {
    const {user} = useSelector((state) => state.auth)
    const [open, setOpen] = useState(false)
    const navigate = useNavigate();

    const isComplete = task?.status === 'Complete';
    
    //console.log('Task Status:', task?.status);
    //console.log('Is Complete:', isComplete);
    const openTaskDetails = () => { 
        navigate(`/task/${task._id}`);
    }

  return ( 
  <>
        <div className={clsx('w-full h-fit p-4 rounded', isComplete ? 'bg-[#F1EFF7]' : 'bg-white shadow-md')}> 
      
        <div className='w-full flex justify-between mb-1'>
            {/* priority icon */}
            <div className={clsx("flex flex-1 gap-1 items-center text-sm font-medium", isComplete ? PRIORITY_AFTER[task?.priority] : PRIORITY_STYLE[task?.priority])}>
                {/*<span className='text-lg'>{ICONS[task?.priority]}</span>*/}
                <span className='capitalize font-bold'>{task?.priority}</span>
            </div>
            {/* task dialog */}
            <TaskDialog task={task} />
        </div>

        <>
        {/* task title  */}
        <div className='flex items-center gap-2'>
            <div className={clsx("w-4 h-4 rounded-full", isComplete? TASK_AFTER[task?.status] : TASK_TYPE[task?.status])}/> 
            <h4 className={clsx('line-clamp-1 cursor-pointer', isComplete ? 'line-through text-gray-400 text-sm' : 'text-black font-bold')} onClick={openTaskDetails}>
                {task?.title}
            </h4>
        </div>
        {/* task description */} 
        <p className={clsx('text-sm overflow-x-auto mt-2 line-clamp-1', isComplete ? 'line-through text-gray-400' : 'text-gray-600 ')}>
            {task?.description || "No description"}
        </p>
        </>

        <div className=''> {/* under one straight line*/}
            <div className='flex items-center justify-between mb-2 mt-5'>
                {/* left side*/}
                <div className='flex items-center gap-3'>
                    {/* date */}
                    <span className={clsx('text-sm font-medium', isComplete ? 'text-gray-400 line-through' : 'text-gray-600')}>
                        Due: <span className={clsx(isComplete? '' : 'underline' )}>{formatDate(new Date(task?.datelines))}</span>
                    </span>
                </div>
                {/* right side*/}
                <div className='flex items-center justify-center gap-2'>
                    {/* created by */}
                    <div className={clsx('text-sm', isComplete ? 'text-gray-400 line-through' : 'text-gray-600')}>by:</div>
                    {/* user */}
                    <div className={clsx("w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1 ", isComplete ? 'bg-gray-300' : 'bg-slate-500')} >
                        <span className='text-center'>
                        {getInitials(task?.created_by?.username)}
                        </span>
                    </div>
                </div>
                

            </div>
        </div>

    </div> {/* close 1 */}
    
  </>
  )
    
}

export default TaskCard