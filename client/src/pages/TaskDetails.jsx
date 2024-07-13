import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetTaskIDQuery } from '../redux/slices/api/taskApiSlice';
import Loading from '../components/Loader';
import { useSelector } from 'react-redux';
import Title from '../components/Title';
import clsx from 'clsx';
import { getInitials } from '../utils';
import moment from 'moment';
import { FaFlagCheckered, FaRegClock, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

const type = {
  Incomplete: 'bg-red-500',
  Complete: 'bg-green-500',
  High: "bg-red-500",
  Medium: "bg-yellow-500",
  Low: "bg-green-500",
};

const typedate = {
  Incomplete: 'text-red-500',
  Complete: 'text-green-500',
};

const typeUser = {
  Incomplete: 'bg-red-500',
  Complete: 'bg-green-500',
};

const TaskDetails = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { data, isLoading, refetch } = useGetTaskIDQuery({ _id: id });

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
    if (data && data.task) {
      const task = data.task;
      const deadlineDate = new Date(task.datelines);
      const currentDate = new Date();
      const startDate = new Date(task.createdAt);
      const completionDate = new Date(task.updatedAt);

      // Calculate remaining days
      const remainingTime = deadlineDate - currentDate;
      const daysLeft = Math.ceil(remainingTime / (1000 * 3600 * 24));
      setDaysRemaining(daysLeft);

      // Check if task is late
      setIsLate(daysLeft < 0 && task.status === 'Incomplete');

      // Calculate position of current date marker if not late
      if (!isLate && currentDate < deadlineDate) {
        const totalDuration = deadlineDate - startDate;
        const elapsedDuration = currentDate - startDate;
        const progressPercentage = (elapsedDuration / totalDuration) * 100;
        setCurrentDatePosition(`${progressPercentage}%`);
      } else {
        setCurrentDatePosition(null); // Hide current date marker if late or completed
      }

      // Calculate position of completion date marker if task is complete
      if (task.status === 'Complete') {
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

  const task = data?.task || data?.data || data;
  const startDate = new Date(task?.createdAt);
  const deadlineDate = new Date(task?.datelines);
  const currentDate = new Date();

  const handleMarkerHover = (marker) => {
    setHoveredMarker(marker);
  };

  return (
    <div className='w-full flex flex-col gap-3 mb-4 overflow-y-hidden'>
      {/* Back button */}
      <Link to='/tasks' className='text-blue-600 hover:underline'>Back to Task List</Link>

      <Title title={task.title} />

      <div className='w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow p-8 overflow-y-auto rounded'>
        <div className='w-full md:w-2/3 space-y-8'>
          <div className='flex items-center gap-3'>
            <div className={clsx('rounded-full px-2 py-1 p-1 font-medium', type[task?.priority])}>
              <span className=' text-white'>{task?.priority}</span>
            </div>
            <div className={clsx('font-medium rounded-full px-2 py-1', type[task?.status])}>
              <span className='text-white'>{task?.status}</span>
            </div>
            {isLate && (
              <div className='text-red-500 underline'>
                Late by {Math.abs(daysRemaining)} {Math.abs(daysRemaining) === 1 ? 'Day' : 'Days'}
              </div>
            )}
          </div>

          <p className='text-gray-500'>Created At: {new Date(task?.createdAt).toDateString()}</p>
          
          <div className='space-y-3'>
            <div>
              <p className='font-bold text-md'>Task Title:</p>
              <span className='px-2'>{task?.title}</span>
            </div>
            <div>
              <p className='font-bold text-md'>Task Description:</p>
              <span className='px-2'>{task?.description}</span>
            </div>
          </div>

          <div className='w-full flex items-center gap-8 p-2 border-y border-gray-200 md:gap'>
            <div className='space-x-2'>
              <span className='font-bold'>Deadlines:</span>
              <span className={clsx('font-semibold', typedate[task?.status], isLate && 'text-red-500')}>
                {new Date(task?.datelines).toDateString()}
              </span>
            </div>
            <span className='text-gray-400'>|</span>
            <div className='space-x-2 flex items-center gap-2'>
                    Created By: 
                    <span>
                      <div className={"w-8 h-8 rounded-full text-white flex items-center justify-center text-sm -mr-1 bg-slate-600"} >
                          <span className='text-center'>
                            {getInitials(task?.created_by?.username)}
                          </span>
                        </div>
                    </span>
                    {task?.created_by?.username}
          </div>
          </div>

          <div className='space-y-3 py-3'>
            <p className='text-gray-600 font-semibold text-sm'>Assign To</p>
            {task?.mentioned_user?.map((m, index) => (
              <div key={index} className='flex gap-4 py-2 items-center border-t border-gray-200'>
                <div className={'w-8 h-8 rounded-full text-white flex items-center justify-center text-sm -mr-1 bg-slate-600'}>
                  <span className='text-center'>{getInitials(m?.username)}</span>
                </div>
                <div>
                  <p className='text-md font-semibold'>{m?.username}</p>
                </div>
                {m?._id === user?._id && (
                  <div>
                    <p className={clsx('rounded-full px-2 py-1 text-white', typeUser[task?.status])}>You</p>
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
            {currentDatePosition !== null && task.status !== 'Complete' && (
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
            {/* Task Complete Marker */}
            {completionDatePosition && (
              <div
                className='timeline-marker'
                style={{ position: 'absolute', top: completionDatePosition, left: '-16px' }}
                onMouseEnter={() => handleMarkerHover('complete')}
                onMouseLeave={() => handleMarkerHover(null)}
              >
                <FaCheckCircle style={{ color: '#4CAF50', fontSize: '24px' }} />
                {(hoveredMarker === 'complete' || hoveredMarker === null) && (
                  <div className='marker-tooltip' style={{ position: 'absolute', left: '30px', transform: 'translateX(0)' }}>
                    <h3>Task Complete</h3>
                    <p>{moment(task.updatedAt).format('MMMM Do, YYYY')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TaskDetails;
