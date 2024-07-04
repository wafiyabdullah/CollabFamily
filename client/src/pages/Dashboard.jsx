import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import moment from "moment";
import clsx from "clsx";
import { useNavigate } from 'react-router-dom';

import { useGetDashboardQuery } from '../redux/slices/api/dashboardApiSlice';

import { TbCalendarDue } from "react-icons/tb";
import { RiBillLine } from "react-icons/ri";
import { BsListTask } from "react-icons/bs";
import { GoGraph } from "react-icons/go";

import ChartBill from "../components/ChartBill";
import Chart from "../components/Chart";
import Loading from "../components/Loader";
import Button from "../components/Button";
import Notification from "../components/Notification";

{/* ------------------------------------------------------------------------------TASK AREA (LEFT SIDE)--------------------------------------------------------------------------------- */}
// TaskTable component
const TaskTable = ({tasks}) => {
  
  // TableHeader component
  const TableHeader = () => (
    <thead className="border-b border-gray-300 ">
      <tr className='text-black text-left'>
        <th className='py-2'>Activities</th>
        <th className='py-2'>Created By</th>
        <th className='py-2 '>Created At</th>
      </tr>
    </thead>
  )

  // each TableRow component
  const TableRow = ({task}) => 
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-300/10'>
      {/*activities */}
        <td className=''>
          <div className='items-center'>
            <p className='text-base text-black'>{task.title}</p>
          </div>
        </td>
        {/*created by */}
         <td className=''> 
          <div className=''>
              {task.created_by.username}
          </div>
        </td> 
      {/*created at */}
        <td className='py-2 hidden md:block'>
            <span className='text-base text-gray-600'>
              {moment(task?.createdAt).fromNow()}
            </span>
        </td>
    </tr>;

  // TaskTable component
  return (
    <>
      <div className='w-full bg-white px-2 md:px-4 pt-4 pb-4 shadow-md rounded'>
      <div className='w-fit justify-center items-center '>
            <h3 className='font-semibold text-lg rounded-full bg-slate-100 px-2 py-1'>Recent Activities</h3>
        </div>
        <table className="w-full">
          <TableHeader />
            <tbody>
              {tasks?.map((task, id) => (
                  <TableRow key={id} task={task} />
                ))}
            </tbody>
        </table>
      </div>
    </>
  )
}
{/* ------------------------------------------------------------------------------Notification AREA (RIGHT SIDE)--------------------------------------------------------------------------------- */}



{/* ------------------------------------------------------------------------------DASHBOARD AREA--------------------------------------------------------------------------------- */}
const Dashboard = () => {

  const user = useSelector((state) => state.auth.user) //get user from redux store
  const [open, setOpen] = useState(false) //modal state
  const [openBill, setOpenBill] = useState(false) //modal state
  const [isLoading, setIsLoading] = useState(true) //loading state
  const navigate = useNavigate();
  const {data, refetch} = useGetDashboardQuery() //fetch data from api
  
  // Redirect based on user role after login
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin'); // Redirect admin user to /admin route
      } else {
        navigate('/dashboard'); // Redirect general user to /dashboard route
        setIsLoading(false);
      }
    }
  }, [user, navigate]);

  // Fetch dashboard data on component mount or user change
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && user.role !== 'admin') {
          await refetch(); // This will fetch data only if user is not admin
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false); // Set loading to false regardless of success or error
      }
    };

    if (user && user.role !== 'admin') {
      fetchData();
    } else {
      setIsLoading(false); // Stop loading immediately for admin users
    }
  }, [user, refetch]);


  {/* ---------------------------------------------------------------LOGIC API END--------------------------------------------------------------------------------- */}
  const tasks = data?.response ? data.response.recentActivity : [];
  const totalPriority = data?.response ? data.response.totalPriority : [];
  const billPerMonth = data?.response ? data.response.totalBillsByMonth : [];
  const DueNoti = data?.response ? data.response.NotiTasksAndBills : [];
  //console.log(totalPriority);
  const HeaderData = data?.response ? [
    {
      _id: "1",
      label: "COMPLETE TASK",
      total: data.response.totalTaskCount,
      icon: <BsListTask />,
      bg: "bg-emerald-700", // Green shade
      iconbg : "bg-emerald-600"
    },
    {
      _id: "2",
      label: "INCOMPLETE TASK",
      total: data.response.totalDueTaskCount,
      icon: <TbCalendarDue />,
      bg: "bg-cyan-700", // Yellow shade
      iconbg : "bg-cyan-600"
    },
    {
      _id: "3",
      label: "OUTSTANDING AMOUNT",
      total: "RM " + data.response.totalBillCount,
      icon: <RiBillLine />,
      bg: "bg-indigo-800", // Blue shade
      iconbg : "bg-indigo-600"
    },
    {
      _id: "4",
      label: "UNPAID BILL",
      total: data.response.totalDueBillCount,
      icon: <TbCalendarDue />,
      bg: "bg-fuchsia-800", // Red shade
      iconbg : "bg-fuchsia-600"
    },
  ] : [];

  // Card component
  const Card = ({label, count, bg, icon, iconbg}) => {
    return (
      <div className={clsx('w-full h-32  p-5 shadow-md rounded-md flex items-center justify-between', bg)}>
        <div className='h-full flex flex-1 flex-col justify-between'>
          <p className='text-base text-white font-bold'>{label}</p>
          <span className='text-2xl font-light text-white'>{count}</span>
          <span className='text-sm text-gray-400'></span>
        </div>
      {/* Icon  */} 
      <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center text-white", iconbg)}>
        {icon}
      </div>

      </div>
    )
  }

 {/* ------------------------------------------------------------return--------------------------------------------------------------------------------- */} 
  return (
    <div className='h-full py-2'>
      {isLoading ? (
        <Loading />
     ) : (
      <>
      {/* top card */}
      {/* passing props of object to Card component */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
        {HeaderData.map(({icon, bg, label, total, iconbg}, index) => (
          <Card key={index} icon={icon} bg={bg} label={label} count={total} iconbg={iconbg}/> //passing props to Card component
        ))}
      </div>
      <div className='flex my-4'>
        <Button 
          onClick={() => setOpenBill(true)}
          label="Bill per Month" 
          icon={<GoGraph className="text-lg"/>} 
          className="flex flex-row-reverse gap-1 justify-center items-center bg-blue-700 text-white rounded-md py-2 2xl:py-2.5 hover:bg-blue-800"
        />
      </div>
      <div className='w-full gap-2 2xl:gap-2 '>
      {/* task priority Chart */}
        <div className='md:w-full bg-white my-4 p-4 rounded shadow-sm border border-gray-200'>
          <div className=''>
            
              <h4 className='text-xl text-gray-600 font-bold pb-4'>
                Priority Bar Chart
              </h4>
            <Chart data = {totalPriority}/> 
          </div>  
        </div> 

      </div>

      {/*Task */}    
      <div className='w-full flex flex-col md:flex-row gap-2 2xl:gap-4'>
          {/*left side*/}
           <TaskTable tasks = {tasks}/>

          {/*right side*/}
          <Notification DueNoti = {DueNoti}/>

      </div>

      </>
     )}
    <ChartBill data = {billPerMonth} open={openBill} setOpen={setOpenBill}/>
    
    </div>
  )

  
}

export default Dashboard