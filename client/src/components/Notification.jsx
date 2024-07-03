import React from 'react';
import moment from 'moment';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import clsx from 'clsx';
import { getInitials } from "../utils";

const Priority = {
  High: 'text-red-500',
  Medium: 'text-yellow-500',
  Low: 'text-green-500',
};

const Notification = ({ DueNoti }) => {
  
  const TableHeader = () => ( 
    <thead className="border-b border-gray-300 ">
      <tr className='text-black text-left'>
        <th className='py-2 w-21 h-8 '>Title</th>
        <th className='w-21 h-8 '>Priority</th>
        <th className='w-21 h-8 '>Datelines</th>
        <th className='w-21 h-8 '>Family Member</th>
      </tr>
    </thead>
  )
  
  const getRelativeTime = (deadline) => {
    const today = moment().startOf('day'); // Start of today, ignoring time
    const dueDate = moment(deadline).startOf('day'); // Start of deadline date, ignoring time
    const diffDays = dueDate.diff(today, 'days');
  
    if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === -1) {
      return 'Yesterday';
    } else if (diffDays < 0) {
      return `${Math.abs(diffDays)} days late`;
    } else {
      return `${diffDays} days left`;
    }
  };

  const TableRow = ({DueNoti}) => 
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-300/10'>
        <td className=''>
          <div className='items-center'>
            <p className='text-base text-black'>{DueNoti.title}</p>
          </div>
        </td>
         <td className=''> 
          <div className={clsx('',Priority[DueNoti.priority])}>
              {DueNoti.priority}
          </div>
        </td> 
        <td className='py-2 hidden md:block'>
            <span className='text-base text-gray-600'>
                {getRelativeTime(DueNoti.datelines)}
            </span>
        </td>
        <td>
        <div className="flex flex-wrap gap-1">
          {DueNoti.mentioned_user.map((user, index) => (
            <div key={index} className="w-7 h-7 rounded-full text-white flex items-center justify-center text-sm bg-blue-700">
              <span className='text-center'>{getInitials(user.username)}</span>
            </div>
          ))}
        </div>
      </td>
       
    </tr>;
  
  return (
    <>
      <div className='w-full bg-white px-2 md:px-4 pt-4 pb-4 shadow-md rounded'>
        <div className='w-fit justify-center items-center '>
            <h3 className='font-semibold text-lg rounded-full bg-slate-100 px-2 py-1'>Due Tomorrow</h3>
        </div>
        <table className="w-full">
          <TableHeader />
            <tbody>
            {DueNoti?.map((DueNoti, id) => (
                  <TableRow key={id} DueNoti={DueNoti} />
                ))}
            </tbody>
        </table>
      </div>
    </>
  );
};

export default Notification;