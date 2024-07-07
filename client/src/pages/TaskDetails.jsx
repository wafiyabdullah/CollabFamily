import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetTaskIDQuery } from '../redux/slices/api/taskApiSlice';
import Loading from '../components/Loader';
import { useSelector } from 'react-redux';
import Title from '../components/Title';
import clsx from 'clsx';
import { getInitials } from '../utils';

const type = {
  Incomplete: 'bg-red-500',
  Complete: 'bg-green-500',
  High: 'bg-red-500',
  Medium: 'bg-yellow-500',
  Low: 'bg-green-500',
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

  if (isLoading) {
    return (
      <div className='py-10'>
        <Loading />
      </div>
    );
  }

  const task = data?.task || data?.data || data;

  return (
    <div className='w-full flex flex-col gap-3 mb-4 overflow-y-hidden '>
      <Title title={task.title} />

      <div className='w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow p-8 overflow-y-auto rounded'>
        <div className='w-full md:w-1/2 space-y-8'>
          <div className='flex items-center gap-3'>
            <div className={clsx('font-medium rounded-full px-2 py-1', type[task?.priority])}>
              <span className=' text-white'>{task?.priority}</span>
            </div>
            <div className={clsx('font-medium rounded-full px-2 py-1', type[task?.status])}>
              <span className=' text-white'>{task?.status}</span>
            </div>
          </div>

          <p className='text-gray-500'>created At: {new Date(task?.createdAt).toDateString()}</p>

          <div className='space-y-3'>
            <div>
              <p className='font-bold text-md'>Task Title: </p>
              <span className='px-2'>{task?.title}</span>
            </div>
            <div>
              <p className='font-bold text-md'>Task Description: </p>
              <span className='px-2 '>{task?.description}</span>
            </div>
          </div>

          <div className='w-full flex items-center gap-8 p-2 border-y border-gray-200 md:gap'>
            <div className='space-x-2'>
              <span className='font-bold'>Deadlines:</span>
              <span className={clsx('font-semibold', typedate[task?.status])}>
                {new Date(task?.datelines).toDateString()}
              </span>
            </div>
            <span className='text-gray-400'>|</span>
            <div className='space-x-2 flex items-center gap-2'>
              Created By:
              <span>
                <div className={'w-8 h-8 rounded-full text-white flex items-center justify-center text-sm -mr-1 bg-slate-600'}>
                  <span className='text-center'>
                    {getInitials(task?.created_by?.username)}</span>
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
      </div>
    </div>
  );
};

export default TaskDetails;
