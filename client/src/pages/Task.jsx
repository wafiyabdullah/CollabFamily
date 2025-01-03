import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { toast } from 'sonner';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import { IoMdAdd } from 'react-icons/io';
import { IoIosRefresh } from "react-icons/io";

import AddTask from '../components/task/AddTask';
import Loading from '../components/Loader';
import Button from '../components/Button';
import TaskCard from '../components/TaskCard';
import Title from '../components/Title';
import NoTaskBill from '../components/NoTaskBill';

import { useGetTaskQuery } from "../redux/slices/api/taskApiSlice";

const statusref = {
  "Incomplete": "Incomplete",
  "Complete": "Complete",
}

const animatedComponents = makeAnimated();

const taskSort = [
  { value: 'My task', label: 'My Task' },
  { value: 'ThisMonth', label: 'This Month' },
  { value: 'ClosestDatelines', label: 'Closest Deadlines' },
  { value: 'HighPriority', label: 'High Priority' },
  { value: 'Incomplete', label: 'Incomplete' },
]

const Task = () => {
  const params = useParams(); // this is for getting the params from the url
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [sortCriteria, setSortCriteria] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const status = params?.status || ""; // this is for getting the status from the url

  // API LOGIC START
  const user = useSelector((state) => state.auth.user); // get user from redux store
  const { data, refetch, isFetching } = useGetTaskQuery(); // fetch data from api

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
    let sortedTasks = [...data?.response?.tasks || []];

    if (sortCriteria.length === 0 || sortCriteria.some(criteria => criteria.value === 'All')) {
      // If no criteria or 'All' is selected, show all tasks
      setFilteredTasks(sortedTasks);
      return;
    }

    const criteriaValues = sortCriteria.map(criteria => criteria.value);

    if (criteriaValues.includes('My task')) {
      // Filter tasks where the logged-in user is mentioned
      sortedTasks = sortedTasks.filter(task => task.mentioned_user.some(u => u._id === user._id));
    }

    if (criteriaValues.includes('ThisMonth')) {
      // Filter tasks for the current month and current year
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth(); // Get the current month (0-11)
      const currentYear = currentDate.getFullYear(); // Get the current year

      sortedTasks = sortedTasks.filter(task => {
        const taskDate = new Date(task.datelines);
        return taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear;
      });
    }

    // Filter based on multiple selected criteria
    if (criteriaValues.includes('ClosestDatelines')) {
      sortedTasks = sortedTasks.filter(task => task.status === 'Incomplete');
      sortedTasks.sort((a, b) => new Date(a.datelines) - new Date(b.datelines));
    }

    if (criteriaValues.includes('HighPriority')) {
      sortedTasks = sortedTasks.filter(task => task.priority === 'High');
    }

    if (criteriaValues.includes('Incomplete')) {
      sortedTasks = sortedTasks.filter(task => task.status === 'Incomplete');
    }

    setFilteredTasks(sortedTasks);
  }, [sortCriteria, data, user._id]);

  const refreshPage = async () => {
    try {
      await refetch();
      toast.info('Data refreshed');
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      minWidth: 200,
    }),
  };

  // API LOGIC END
  return (
    <div className='w-full'>
      {/* button and title */}
      <div className='flex items-center justify-between mb-4 '>
        <Title title={status ? `${status} Tasks` : "Manage Task"} /> 
        <Button 
          onClick={() => setOpen(true)}
          label="Create Task" 
          icon={<IoMdAdd className="text-lg"/>} 
          className="flex flex-row-reverse gap-1 items-center bg-blue-700 text-white rounded-md py-2 2xl:py-2.5 hover:bg-blue-800"
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
          <IoIosRefresh onClick={refreshPage} />
        </div>
        <div className='ml-auto border border-black'>
          <Select
            components={animatedComponents}
            isMulti
            options={taskSort}
            value={sortCriteria}
            onChange={setSortCriteria}
            styles={customStyles}
          />
        </div>
      </div>
      {/* each task card*/}
      <div>
        {isLoading || isFetching ? (
          <div className='py-10'>
            <Loading />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className='py-10 text-center text-gray-500 justify-center items-center'>
            <NoTaskBill />
            <div className='text-center mt-4'>There are no task.</div>
          </div>
        ) : (
          <div className='w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 2xl:gap-4'>
            {filteredTasks.map((task, index) => (
              <TaskCard key={index} task={task} />
            ))}
          </div>
        )}
      </div>
      <AddTask open={open} setOpen={setOpen} familyMembers={data?.response?.familyMembers || []} />
    </div>
  );
}

export default Task;
