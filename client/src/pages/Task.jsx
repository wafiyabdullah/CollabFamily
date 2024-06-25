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
  const [sortCriteria, setSortCriteria] = useState('All');
  const [filteredTasks, setFilteredTasks] = useState([]);
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

  useEffect(() => {
    let sortedTasks = [...data?.tasks || []];

    switch (sortCriteria) {
      case 'ClosestDatelines':
        sortedTasks.sort((a, b) => new Date(a.datelines) - new Date(b.datelines));
        break;
      case 'HighPriority':
        sortedTasks.sort((a, b) => {
          const priorities = { High: 1, Medium: 2, Low: 3 };
          return priorities[a.priority] - priorities[b.priority];
        });
        break;
      case 'Incomplete':
        sortedTasks = sortedTasks.filter((task) => task.status === 'Incomplete');
        break;
      default:
        break;
    }

    setFilteredTasks(sortedTasks);
  }, [sortCriteria, data]);

  const refreshPage = async () => {
    try {
      await refetch();
      toast.info('Data refreshed');
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  //console.log(tasks)

  //API LOGIC END
  return (
    
    <div className='w-full'>
      {/* button and title */}
      <div className='flex items-center justify-between mb-4 '>
        <Title title={status? `${status} Tasks`: "Manage Task"} /> 
          <Button 
            onClick={() => setOpen(true)}
            label="Create Task" 
            icon={<IoMdAdd className="text-lg"/>} 
            className="flex flex-row-reverse gap-1 items-center bg-violet-700 text-white rounded-md py-2 2xl:py-2.5 hover:bg-violet-800"
            />
      </div>
      <div className='w-full flex items-center py-4 gap-3'>
        <div className='cursor-default w-24 h-11 bg-green-500 p-2 flex rounded justify-center items-center'>
              <h4 className='text-white'>{statusref.Complete}</h4>
        </div> 
        <div className='cursor-default w-24 h-11 bg-red-500 p-2 flex rounded justify-center items-center'>
              <h4 className='text-white'>{statusref.Incomplete}</h4>
        </div>
        <div className='rounded-full hover:bg-slate-200 p-1 flex justify-center items-center cursor-pointer'>
          <IoIosRefresh onClick={refreshPage}/>
        </div>
        <div className='ml-auto border border-black'>
          <select 
            onChange={(e) => setSortCriteria(e.target.value)}
          >
            <option value='All'>All</option>
            <option value='ClosestDatelines'>Closest Datelines</option>
            <option value='HighPriority'>High Priority</option>
            <option value='Incomplete'>Incomplete</option>
          </select>
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
            {filteredTasks.map((task, index) => (
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