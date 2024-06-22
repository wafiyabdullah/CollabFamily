import React from 'react'
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { getInitials } from "../utils";
import clsx from 'clsx';

import { useGetBillIDQuery } from '../redux/slices/api/billApiSlice';
import Loading from '../components/Loader';
import Title from '../components/Title';

const type = {
  Unpaid: "bg-red-500",
  Paid: "bg-green-500",
  High: "bg-red-500",
  Medium: "bg-yellow-500",
  Low: "bg-green-500",
}

const BillDetails = () => {
  
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user)
  const { data, isLoading, refetch } = useGetBillIDQuery({ _id: id });

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

  const bill = data?.bill || data?.data || data;
  
  return (
    <div className='w-full flex flex-col gap-3 mb-4 overflow-y-hidden'>
        <Title title={bill.title} />

        <div className='w-3/4 flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow p-8 overflow-y-auto rounded'>
            <div className='w-full md:w-1/2 space-y-8'>
                
                <div className='flex items-center gap-3'>
                  <div className={clsx('border p-1 font-medium', type[bill?.priority])}>
                    <span className=' text-white'>{bill?.priority}</span>
                  </div>
                  <div className={clsx('border p-1 font-medium', type[bill?.status])}>
                    <span className=' text-white'>{bill?.status}</span>
                  </div>
                </div>

                <p className='text-gray-500'>
                  created At: {new Date(bill?.createdAt).toDateString()}
                </p>

                <div className='space-y-3'>
                    <div className=''>
                      <span className='font-semibold'>Bill Title: </span> {bill?.title}
                    </div>
                    <div className=''>
                      <span className='font-semibold'>Bill Amount: </span> {bill?.amount}
                    </div>
                </div>

                <div className='flex items-center gap-8 p-2 border-y border-gray-200'>
                  <div className='space-x-2'>
                    Datelines: {new Date(bill?.datelines).toDateString()}
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
                  <p className='text-gray-600 font-semibold text-sm'>
                     Family Members
                  </p>
                  <div className='space-y-3'>
                    {bill?.familyId?.familyMembers?.map((m, index) => (
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

export default BillDetails