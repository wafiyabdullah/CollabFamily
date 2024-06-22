import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
import { toast } from 'sonner'

import { IoMdAdd } from 'react-icons/io'
import { IoIosRefresh } from "react-icons/io";

import Loading from '../components/Loader'
import Title from '../components/Title'
import Button from '../components/Button'
import AddBill from '../components/bill/AddBill'

import BillCard from '../components/BillCard'

import { useGetBillQuery } from "../redux/slices/api/billApiSlice";

const statusref = {
  "Paid": "Paid",
  "Unpaid": "Unpaid",
}

const Bill = () => {

  const params = useParams() // this is for getting the params from the url

  const [isLoading, setIsLoading] = useState(true)
  const [open, setOpen] = useState(false)
  
  const status = params?.status || "" // this is for getting the status from the url
   //API LOGIC START
  const user = useSelector((state) => state.auth.user) //get user from redux store
  
  const {data, refetch, isFetching} = useGetBillQuery() //fetch data from api

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          setIsLoading(true);
          await refetch(); // This will fetch data only if user is logged in
        }
      } catch (error) {
        console.error('Error fetching bill data:', error);
      } finally {
        setIsLoading(false); // Set loading to false regardless of success or error
      }
    };

    fetchData();
  }, [user, refetch]);

    const refreshPage = () => {
      refetch()
      toast.info("data refreshed")
    }

    const bills = data?.bills || [];

    console.log(bills)
  //API LOGIC END
  return (
    
    <div className='w-full'>
      {/* button and title */}
      <div className='flex items-center justify-between mb-4 '>
        <Title title={status? `${status} Bill`: "Manage Bill"} /> {/* "status? `${status} Tasks`: "Tasks" for */}
        {
          <Button
            onClick={() => setOpen(true)} 
            label="Create Bill" 
            icon={<IoMdAdd className="text-lg"/>} 
            className="flex flex-row-reverse gap-1 items-center bg-violet-700 text-white rounded-md py-2 2xl:py-2.5"
            />
        }
      </div>
      <div className='flex items-center w-1/4 py-4 gap-3'>
        <div className='w-3/4 h-fit bg-green-500 shadow-md  shadow-green-500/40 p-2 flex rounded justify-center items-center'>
              <h4 className='text-white '>{statusref.Paid}</h4>
        </div>
        <div className='w-3/4 h-fit bg-red-500 shadow-md  shadow-red-500/40 p-2 flex rounded justify-center items-center'>
              <h4 className='text-white '>{statusref.Unpaid}</h4>
        </div> 
        <div className='rounded-full hover:bg-slate-200 p-1 flex justify-center items-center'>
          <IoIosRefresh onClick={refreshPage}/>
        </div>
      </div> 
      {/* each bill card*/}
      <div>
          {isLoading || isFetching ? (
               <div className='py-10'>
               <Loading />
             </div>
          ) : (
            <div bill={bills} className='w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 2xl:gap-4'>
              {
                bills.map((bill, index) => (
                    <BillCard key={index} bill={bill} />
                ))
              }
            </div>
            )}
      </div>

      <AddBill open={open} setOpen={setOpen}/>
  </div>
  )
}

export default Bill