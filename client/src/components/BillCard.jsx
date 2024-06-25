import React from 'react'
import clsx from 'clsx'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { getInitials } from "../utils";
import { useNavigate } from 'react-router-dom';

import BillDialog from '../components/bill/BillDialog'
import { formatDate } from '../utils'
import { PRIORITY_STYLE, TASK_TYPE, PRIORITY_AFTER, TASK_AFTER } from '../utils'

const BillCard = ({bill}) => {
    const {user} = useSelector((state) => state.auth)
    const [open, setOpen] = useState(false)
    const navigate = useNavigate();

    const isPaid = bill?.status === 'Paid';

    //console.log('Bill Status:', bill?.status);
    //console.log('Is Paid:', isPaid);

    const openBillDetails = () => { 
        navigate(`/bill/${bill._id}`);
    }

    return (
    <>
        <div className={clsx('w-full h-fit p-4 rounded', isPaid ? 'bg-[#F1EFF7]' : 'bg-white shadow-md')}> {/* open 1 */}
            
            <div className='w-full flex justify-between mb-1'>
                {/* priority icon */}
                <div className={clsx("flex flex-1 gap-1 items-center text-sm font-medium", isPaid? PRIORITY_AFTER[bill?.priority] : PRIORITY_STYLE[bill?.priority])}>
                    {/*<span className='text-lg'>{ICONS[bill?.priority]}</span>*/}
                    <span className='capitalize font-bold'>{bill?.priority}</span>
                </div>
                {/* bill dialog */}
                <BillDialog bill={bill} />
            </div>

            <>
                {/* bill title  */} 
                <div className='flex items-center gap-2'>
                    <div className={clsx("w-4 h-4 rounded-full",isPaid? TASK_AFTER[bill.status] : TASK_TYPE[bill.status])} />
                    <h4 className={clsx('line-clamp-1 cursor-pointer', isPaid? 'line-through text-gray-400 text-sm' : 'text-black font-bold')} onClick={openBillDetails}>
                        {bill?.title}
                    </h4>
                </div>
                {/* task description */} 
                <p className={clsx('text-sm overflow-x-auto mt-2', isPaid? 'line-through text-gray-400' : 'text-gray-600')}>
                    <span>RM: {bill?.amount || "No description"}</span>
                </p>
            </> 

            <div className=''>{/* under one straight line*/}
                <div className='flex items-center justify-between mb-2 mt-5'>
                    {/* left side*/}
                    <div className='flex items-center gap-3'>
                        {/* date */}
                        <span className={clsx('text-sm  font-medium', isPaid? 'text-gray-400 line-through' : 'text-gray-600')}>
                            Due: <span className={clsx(isPaid? '' : 'underline')}>{formatDate(new Date(bill?.datelines))}</span>
                        </span>
                    </div>
                    {/* right side*/}
                    <div className='flex items-center justify-center gap-2'>
                        {/* created by */}
                        <div className={clsx('text-sm ', isPaid? 'text-gray-400 line-through' : 'text-gray-600')}>by:</div>
                        {/* user */}
                        <div className={clsx("w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1 ", isPaid? 'bg-gray-300' : 'bg-slate-500')} >
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