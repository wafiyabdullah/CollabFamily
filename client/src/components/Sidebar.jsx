import React from 'react'
import {
  MdSpaceDashboard,
  MdFamilyRestroom,
  
} from "react-icons/md";
import { BiMoneyWithdraw } from "react-icons/bi";
import { FaTasks, FaUsers } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import clsx from 'clsx';
import {setOpenSidebar} from "../redux/slices/authSlice";

// Sidebar component
const linkData = [
  {
    label: "Dashboard",
    link: "dashboard",
    icon: <MdSpaceDashboard/>,
  },
  {
    label: "Task",
    link: "tasks",
    icon: <FaTasks />,
  },
  {
    label: "Bill",
    link: "bill",
    icon: <BiMoneyWithdraw />,
  },
  {
    label: "Family",
    link: "family",
    icon: <FaUsers />,
  },
  {
    label: "Admin Home",
    link: "admin",
    icon: <MdFamilyRestroom />,
  }
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth); //useSelector to get user from redux for auth

  const dispatch = useDispatch(); //useDispatch to dispatch actions
  const location = useLocation(); //useLocation to get location

  const path = location.pathname.split("/")[1]; //get path

  //const sidebarLinks = linkData; //sidebar links to linkData
  const sidebarLinks = user?.role === 'admin'
    ? linkData.filter(link => link.label === "Admin Home")
    : linkData.filter(link => link.label !== "Admin Home");

  const closeSidebar = () => { //close sidebar
    dispatch(setOpenSidebar(false));
  };
  

  // NavLink component
  const NavLink = ({ el }) => {
    return (
      <Link
        to={el.link}
        onClick={closeSidebar}
        className={clsx("w-full flex gap-2 px-8 py-3 items-center text-gray-800 text-base hover:bg-[#27334e2d] rounded-md", 
        path === el.link.split("/")[0] ? "bg-violet-700 text-neutral-100 hover:bg-violet-800 " : ""
        )}
        >
          {el.icon}
          <span className=''>{el.label}</span>
        </Link>
    )
  }

  //return sidebar
  return (
    <div className='w-full h-full flex flex-col gap-6 p-5'>
    <h1 className='flex gap-1 items-center'>
      <p className='bg-violet-700 p-3 rounded-full'>
        <MdFamilyRestroom className='text-white text-2xl font-black'/>
      </p>
      <span className='text-2xl font-bold text-black'>CollabFamily</span>
    </h1>

    <div className='flex-1 flex flex-col gap-y-5 py-8'>
      {
        sidebarLinks.map((link)=>(
          <NavLink el={link} key={link.label} /> 
        ))
      }
    </div>

    {/*trademark*/}
    <div className='justify-center text-center'>
      <span className='w-full flex gap-1 p-1 items-center text-lg text-gray-800 justify-center'>
        <span className='text-sm text-gray-400 '>CollabFamily © 2024</span>
      </span>
      <p className='text-sm text-gray-300'>version 1.0</p>
    </div>
    
  </div>
  );
};

export default Sidebar;