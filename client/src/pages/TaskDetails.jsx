import React from 'react'
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from 'react';
import {useGetTaskIDQuery} from '../redux/slices/api/taskApiSlice';
import Loading from '../components/Loader';
import { useSelector } from 'react-redux'
import Title from '../components/Title';
import clsx from 'clsx';
import { getInitials } from "../utils";

const type = {
    Incomplete: "bg-red-500",
    Complete: "bg-green-500",
    High: "bg-red-500",
    Medium: "bg-yellow-500",
    Low: "bg-green-500",
  }

const TaskDetails = () => {
    const { id } = useParams();
    const user = useSelector((state) => state.auth.user)
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

        <div className='w-3/4 flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow p-8 overflow-y-auto rounded'>
            <div className='w-full md:w-1/2 space-y-8'>
                
                <div className='flex items-center gap-3'>
                  <div className={clsx('border p-1 font-medium', type[task?.priority])}>
                    <span className=' text-white'>{task?.priority}</span>
                  </div>
                  <div className={clsx('border p-1 font-medium', type[task?.status])}>
                    <span className=' text-white'>{task?.status}</span>
                  </div>
                </div>

                <p className='text-gray-500'>
                  created At: {new Date(task?.createdAt).toDateString()}
                </p>

                <div className='space-y-3'>
                    <div className=''>
                      <span className='font-semibold'>Task Title: </span> {task?.title}
                    </div>
                    <div className=''>
                      <span className='font-semibold'>Task Description: </span> {task?.description}
                    </div>
                </div>

                <div className='w-full flex items-center gap-8 p-2 border-y border-gray-200 md:gap'>
                  <div className='space-x-2 '>
                    Datelines: {new Date(task?.datelines).toDateString()}
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
                  <p className='text-gray-600 font-semibold text-sm'>
                     Family Members
                  </p>
                  <div className='space-y-3'>
                    {task?.familyId?.familyMembers?.map((m, index) => (
                      <div
                        key={index}
                        className='flex gap-4 py-2 items-center border-t border-gray-200'
                      >
                      <div
                        className={
                          "w-8 h-8 rounded-full text-white flex items-center justify-center text-sm -mr-1 bg-slate-600"
                        }
                      >
                        <span className='text-center'>
                          {getInitials(m?.username)}
                        </span>
                      </div>

                      <div>
                        <p className='text-md font-semibold'>{m?.username}</p>
                        <span className='text-gray-500'>{m?.role}</span>
                      </div>
                    </div>
                    ))}
                  </div>
                </div>


            </div>
        </div>

    </div>
  )
}

export default TaskDetails