import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import BillDialog from '../components/bill/BillDialog'
import { formatDate, getInitials } from '../utils'
import { PRIORITY_STYLE, TASK_TYPE, PRIORITY_AFTER, TASK_AFTER, CATEGORY, CATEGORY_AFTER } from '../utils'

const BillCard = ({ bill }) => {
  const { user } = useSelector((state) => state.auth)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const isPaid = bill?.status === 'Paid'
  const isUserMentioned = bill?.mentioned_user?.some(mentionedUser => mentionedUser._id === user?._id)

  const openBillDetails = () => {
    navigate(`/bill/${bill._id}`)
  }

  //console.log('Logged-in User ID:', user?._id)
  //console.log('Mentioned User ID:', isUserMentioned)

  return (
    <>
      <div className={clsx('w-full h-fit p-4 rounded', isPaid ? 'bg-[#F1EFF7]' : 'bg-white shadow-md')}>
        <div className='w-full flex mb-1 gap-2'>
          <div className={clsx('flex items-center text-sm font-medium px-2 py-1 rounded-full', isPaid ? PRIORITY_AFTER[bill?.priority] : PRIORITY_STYLE[bill?.priority])}>
            <span className='capitalize font-bold'>{bill?.priority}</span>
          </div>
          <div className={clsx('flex items-center text-sm font-medium px-2 py-1 rounded-full', isPaid ? CATEGORY_AFTER[bill?.category] : CATEGORY[bill?.category])}>
            <span className='capitalize font-bold'>{bill?.category}</span>
          </div>
          <div className='ml-auto'>
            <BillDialog bill={bill} />
          </div>
        </div>
        
        <div className='flex items-center gap-2'>
          <div className={clsx('w-4 h-4 rounded-full', isPaid ? TASK_AFTER[bill.status] : TASK_TYPE[bill.status])} />
          <h4 className={clsx('line-clamp-1 cursor-pointer hover:underline', isPaid ? 'line-through text-gray-400 text-sm' : 'text-black font-bold')} onClick={openBillDetails}>
            {bill?.title}
          </h4>
        </div>
        
        <p className={clsx('text-sm overflow-x-auto mt-2', isPaid ? 'line-through text-gray-400' : 'text-gray-600')}>
          <span>RM: {bill?.amount || 'No description'}</span>
        </p>
        
        <div className='flex items-center justify-between mb-2 mt-5'>
          <div className='flex items-center gap-3'>
            <span className={clsx('text-sm font-medium', isPaid ? 'text-gray-400 line-through' : 'text-gray-600')}>
              Due: <span className={clsx(isPaid ? '' : 'underline')}>{formatDate(new Date(bill?.datelines))}</span>
            </span>
          </div>
          {isUserMentioned && (
            <div className='flex items-center justify-center gap-2'>
              <div className={clsx('text-sm', isPaid ? 'text-gray-400 line-through' : 'text-gray-600')}>to:</div>
              <div className={clsx('w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1', isPaid ? 'bg-gray-300 line-through' : 'bg-slate-500')}>
                <span className='text-center'>You</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default BillCard
