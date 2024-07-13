import React from 'react'
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { getInitials } from "../utils";
import clsx from 'clsx';
import moment from 'moment';
import { FaFlagCheckered, FaRegClock, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

import { useGetBillIDQuery } from '../redux/slices/api/billApiSlice';
import Loading from '../components/Loader';
import Title from '../components/Title';
import {CATEGORY} from '../utils/index'

const type = {
  Unpaid: "bg-red-500",
  Paid: "bg-green-500",
  High: "bg-red-500",
  Medium: "bg-yellow-500",
  Low: "bg-green-500",
}

const typedate = {
  Unpaid: 'text-red-500',
  Paid: 'text-green-500',
};

const typeUser = {
  Unpaid: 'bg-red-500',
  Paid: 'bg-green-500',
};

const BillDetails = () => {
  
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user)
  const { data, isLoading, refetch } = useGetBillIDQuery({ _id: id });

  useEffect(() => { 
    if (user) {
      refetch(); // Trigger refetch if user exists
    }
  }, [id, user, refetch]);

  const [daysRemaining, setDaysRemaining] = useState(0);
  const [isLate, setIsLate] = useState(false);
  const [currentDatePosition, setCurrentDatePosition] = useState(null);
  const [completionDatePosition, setCompletionDatePosition] = useState(null);
  const [hoveredMarker, setHoveredMarker] = useState(null);

  useEffect(() => {
    if (data && data.bill) {
      const bill = data.bill;
      const deadlineDate = new Date(bill.datelines);
      const currentDate = new Date();
      const startDate = new Date(bill.createdAt);
      const completionDate = new Date(bill.updatedAt);
  
      // Calculate remaining days
      const remainingTime = deadlineDate - currentDate;
      const daysLeft = Math.ceil(remainingTime / (1000 * 3600 * 24));
      setDaysRemaining(daysLeft);
  
      // Check if task is late
      setIsLate(daysLeft < 0 && bill.status === 'Unpaid');
  
      // Calculate position of current date marker
      if (!isLate && currentDate < deadlineDate) {
        const totalDuration = deadlineDate - startDate;
        const elapsedDuration = currentDate - startDate;
        const progressPercentage = (elapsedDuration / totalDuration) * 100;
        setCurrentDatePosition(`${progressPercentage}%`);
      } else {
        setCurrentDatePosition(null); // Hide current date marker if late or completed
      }
  
      // Calculate position of completion date marker
      if (bill.status === 'Paid') {
        const totalDuration = deadlineDate - startDate;
        const completionDuration = completionDate - startDate;
        const completionProgressPercentage = (completionDuration / totalDuration) * 100;
        setCompletionDatePosition(`${completionProgressPercentage}%`);
      } else {
        setCompletionDatePosition(null);
      }
    }
  }, [data, isLate]);

  if (isLoading) {
    return (
      <div className='py-10'>
        <Loading />
      </div>
    );
  }

  const bill = data?.bill || data?.data || data;
  const startDate = new Date(bill?.createdAt);
  const deadlineDate = new Date(bill?.datelines);
  const currentDate = new Date();

  const handleMarkerHover = (marker) => {
    setHoveredMarker(marker);
  };
  
  return (
    <div className='w-full flex flex-col gap-3 mb-4 overflow-y-hidden'>
        {/* Back button */}
        <Link to='/bill' className='text-blue-600 hover:underline'>Back to Bill List</Link>
        
        <Title title={bill.title} />

        <div className='w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow p-8 overflow-y-auto rounded'>
            <div className='w-full md:w-1/2 space-y-8'>
                
                <div className='flex items-center gap-3'>
                  <div className={clsx('rounded-full px-2 py-1 p-1 font-medium', type[bill?.priority])}>
                    <span className=' text-white'>{bill?.priority}</span>
                  </div>
                  <div className={clsx('rounded-full px-2 py-1 p-1 font-medium', type[bill?.status])}>
                    <span className=' text-white'>{bill?.status}</span>
                  </div>
                  <div className={clsx('rounded-full px-2 py-1 p-1 font-medium', CATEGORY[bill?.category])}>
                    <span className=''>{bill?.category}</span>
                  </div>
                  {isLate && (
                    <div className='text-red-500 underline'>
                      Late by {Math.abs(daysRemaining)} {Math.abs(daysRemaining) === 1 ? 'Day' : 'Days'}
                    </div>
                  )}
                </div>

                <p className='text-gray-500'>
                  created At: {new Date(bill?.createdAt).toDateString()}
                </p>

                <div className='space-y-3'>
                    <div className=''>
                      <p className='font-bold text-md'>Bill Title: </p> 
                      <span className='px-2'>{bill?.title}</span>
                    </div>
                    <div className=''>
                      <p className='font-bold text-md'>Bill Amount: </p> 
                      <span className='px-2'>RM: {bill?.amount}</span>
                    </div>
                </div>

                <div className='w-full flex items-center gap-8 p-2 border-y border-gray-200'>
                  <div className='space-x-2'>
                    <span className='font-bold'>Deadlines:</span>
                    <span className={clsx('font-semibold', typedate[bill?.status])}>
                      {new Date(bill?.datelines).toDateString()}
                    </span>
                  </div>
                  <span className='text-gray-400'>|</span>
                  <div className='space-x-2 flex items-center gap-2'>
                    Created By: 
                    <span>
                      <div className={"w-8 h-8 rounded-full text-white flex items-center justify-center text-sm -mr-1 bg-slate-600"} >
                          <span className='text-center'>
                            {getInitials(bill?.created_by?.username)}
                          </span>
                        </div>
                    </span>
                    {bill?.created_by?.username}
                  </div>
                </div>

                <div className='space-y-3 py-3'>
                  <p className='text-gray-600 font-semibold text-sm'>Assign To</p>
                  {bill?.mentioned_user?.map((m, index) => (
                    <div key={index} className='flex gap-4 py-2 items-center border-t border-gray-200'>
                      <div className={'w-8 h-8 rounded-full text-white flex items-center justify-center text-sm -mr-1 bg-slate-600'}>
                        <span className='text-center'>{getInitials(m?.username)}</span>
                      </div>
                      <div>
                        <p className='text-md font-semibold'>{m?.username}</p>
                      </div>
                      {m?._id === user?._id && (
                        <div>
                          <p className={clsx('rounded-full px-2 py-1 text-white', typeUser[bill?.status])}>You</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
            </div>

          {/* Right Side for Custom Vertical Timeline */}
        <div className='w-full md:w-1/3 flex flex-col items-center'>
        <div style={{ position: 'relative', width: '2px', backgroundColor: '#e9ecef', height: '100%' }}>
          {/* Start Date Marker */}
          <div
            className='timeline-marker'
            style={{ position: 'absolute', top: '0', left: '-10px' }}
            onMouseEnter={() => handleMarkerHover('start')}
            onMouseLeave={() => handleMarkerHover(null)}
          >
            <FaFlagCheckered style={{ color: '#2186F3', fontSize: '24px' }} />
            {hoveredMarker === 'start' && (
              <div className='marker-tooltip' style={{ position: 'absolute', left: '30px', transform: 'translateX(0)' }}>
                <h3>Start Date</h3>
                <p>{moment(startDate).format('MMMM Do, YYYY')}</p>
              </div>
            )}
          </div>
          {/* Current Date Marker */}
          {currentDatePosition !== null && bill.status !== 'Paid' && (
            <div
              className='timeline-marker'
              style={{ position: 'absolute', top: currentDatePosition, left: '-10px' }}
              onMouseEnter={() => handleMarkerHover('current')}
              onMouseLeave={() => handleMarkerHover(null)}
            >
              <FaRegClock style={{ color: '#FFC107', fontSize: '24px' }} />
              {(hoveredMarker === 'current' || hoveredMarker === null) && (
                <div className='marker-tooltip' style={{ position: 'absolute', left: '30px', transform: 'translateX(0)' }}>
                  <p>{moment(currentDate).format('MMMM Do, YYYY')}</p>
                  <p>Remaining: {daysRemaining} days</p>
                </div>
              )}
            </div>
          )}
          {/* Deadline Marker */}
          <div
            className='timeline-marker'
            style={{ position: 'absolute', bottom: '0', left: '-10px' }}
            onMouseEnter={() => handleMarkerHover('deadline')}
            onMouseLeave={() => handleMarkerHover(null)}
          >
            <FaExclamationCircle style={{ color: '#E91E63', fontSize: '24px' }} />
            {hoveredMarker === 'deadline' && (
              <div
                className='marker-tooltip'
                style={{
                  position: 'absolute',
                  left: '30px',
                  top: '-100%',  // Position it above the marker
                  transform: 'translateY(-100%)',  // Ensure it is completely above the marker
                  marginTop: '-10px',  // Small adjustment to avoid overlap
                }}
              >
                <h3>Deadline</h3>
                <p>{moment(deadlineDate).format('MMMM Do, YYYY')}</p>
              </div>
            )}
          </div>
          {/* Bill Paid Marker */}
          {completionDatePosition && (
            <div
              className='timeline-marker'
              style={{ position: 'absolute', top: completionDatePosition, left: '-16px' }}
              onMouseEnter={() => handleMarkerHover('Paid')}
              onMouseLeave={() => handleMarkerHover(null)}
            >
              <FaCheckCircle style={{ color: '#4CAF50', fontSize: '24px' }} />
              {(hoveredMarker === 'Paid' || hoveredMarker === null) && (
                <div className='marker-tooltip' style={{ position: 'absolute', left: '30px', transform: 'translateX(0)' }}>
                  <h3>Bill Paid</h3>
                  <p>{moment(bill.updatedAt).format('MMMM Do, YYYY')}</p>
                </div>
              )}
            </div>
          )}
          </div>
        </div>      

        </div>
    </div>
  )
}

export default BillDetails