import React from 'react'
import clsx from 'clsx'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { getInitials } from "../utils";

import BillDialog from '../components/bill/BillDialog'
import { formatDate } from '../utils'
import { PRIORITY_STYLE, TASK_TYPE } from '../utils'

const BillCard = ({bill}) => {
    const {user} = useSelector((state) => state.auth)
    const [open, setOpen] = useState(false)
    
    const isPaid = bill?.status === 'Paid';

    //console.log('Bill Status:', bill?.status);
    //console.log('Is Paid:', isPaid);

    return (
    <>
        <div className={clsx('w-full h-fit p-4 rounded', isPaid ? 'bg-[#F1EFF7]' : 'bg-white shadow-md')}> {/* open 1 */}
            
            <div className='w-full flex justify-between mb-1'>
                {/* priority icon */}
                <div className={clsx("flex flex-1 gap-1 items-center text-sm font-medium", PRIORITY_STYLE[bill?.priority])}>
                    {/*<span className='text-lg'>{ICONS[bill?.priority]}</span>*/}
                    <span className='capitalize font-bold'>{bill?.priority}</span>
                </div>
                {/* bill dialog */}
                <BillDialog bill={bill} />
            </div>

            <>
                {/* bill title  */} 
                <div className='flex items-center gap-2'>
                    <div className={clsx("w-4 h-4 rounded-full", TASK_TYPE[bill.status])} />
                    <h4 className='line-clamp-1 text-black font-semibold'>
                        {bill?.title}
                    </h4>
                </div>
                {/* task description */} 
                <p className='text-sm text-gray-600 overflow-x-auto mt-2'>
                    <span>RM: {bill?.amount || "No description"}</span>
                </p>
            </> 

            <div className=''>{/* under one straight line*/}
                <div className='flex items-center justify-between mb-2 mt-5'>
                    {/* left side*/}
                    <div className='flex items-center gap-3'>
                        {/* date */}
                        <span className='text-sm text-gray-600 font-medium'>
                            Due: <span className='underline'>{formatDate(new Date(bill?.datelines))}</span>
                        </span>
                    </div>
                    {/* right side*/}
                    <div className='flex items-center justify-center gap-2'>
                        {/* created by */}
                        <div className='text-sm text-gray-500'>by:</div>
                        {/* user */}
                        <div className={"w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1 bg-slate-500"} >
                            <span className='text-center'>
                                {getInitials(bill?.created_by?.username)}
                            </span>
                    </div>
                      
                    </div>


                </div>
            </div>

        </div>{/* close 1 */}
        

    </>
  )
}

export default BillCard