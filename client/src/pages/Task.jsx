import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
import { toast } from 'sonner'

import { IoMdAdd } from 'react-icons/io'
import { IoIosRefresh } from "react-icons/io";

import AddTask from '../components/task/AddTask'
import Loading from '../components/Loader'
import Button from '../components/Button'
import TaskCard from '../components/TaskCard'
import Title from '../components/Title'

import { useGetTaskQuery} from "../redux/slices/api/taskApiSlice";
 
const statusref = {
  "Incomplete": "Incomplete",
  "Complete": "Complete",
}

const Task = () => {

  const params = useParams() // this is for getting the params from the url

  const [isLoading, setIsLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const status = params?.status || "" // this is for getting the status from the url
  //API LOGIC START
  const user = useSelector((state) => state.auth.user) //get user from redux store

  const {data, refetch, isFetching} = useGetTaskQuery() //fetch data from api

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          setIsLoading(true);
          await refetch(); // This will fetch data only if user is logged in
        }
      } catch (error) {
        console.error('Error fetching task data:', error);
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

  const tasks = data?.tasks || [];

  console.log(tasks)

  //API LOGIC END
  return (
    
    <div className='w-full'>
      {/* button and title */}
      <div className='flex items-center justify-between mb-4 '>
        <Title title={status? `${status} Tasks`: "Manage Task"} /> {/* "status? `${status} Tasks`: "Tasks" for */}
          <Button 
            onClick={() => setOpen(true)}
            label="Create Task" 
            icon={<IoMdAdd className="text-lg"/>} 
            className="flex flex-row-reverse gap-1 items-center bg-violet-700 text-white rounded-md py-2 2xl:py-2.5"
            />
      </div>
      <div className='flex items-center w-1/4 py-4 gap-3'>
      <div className='w-3/4 h-fit bg-green-500 shadow-md shadow-green-500/40 p-2 flex rounded justify-center items-center'>
              <h4 className='text-white'>{statusref.Complete}</h4>
        </div> 
        <div className='w-3/4 h-fit bg-red-500 shadow-md shadow-red-500/40 p-2 flex rounded justify-center items-center'>
              <h4 className='text-white'>{statusref.Incomplete}</h4>
        </div>
        <div className='rounded-full hover:bg-slate-200 p-1 flex justify-center items-center'>
          <IoIosRefresh onClick={refreshPage}/>
        </div>
      </div>
      {/* each task card*/}
      <div>
        {isLoading || isFetching ? (
          <div className='py-10'>
          <Loading />
        </div>
      ) : (
          <div className='w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 2xl:gap-4'>
            {tasks.map((task, index) => (
                <TaskCard key={index} task={task} />
              ))}
          </div>
        )}
      </div>

      <AddTask open={open} setOpen={setOpen} />
    </div>

   )
}

export default Task