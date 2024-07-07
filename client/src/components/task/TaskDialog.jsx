//libraries
import React, { Fragment, useState } from 'react'
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineEdit } from "react-icons/md";
import { MdDone } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFolderOpen } from "react-icons/fa";
import { Menu, Transition } from "@headlessui/react";
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom';

//components
import AddTask from "./AddTask";
import ConfirmationDialog from "../Dialogs";

//api
import { useDeleteTaskMutation, useDoneTaskMutation } from "../../redux/slices/api/taskApiSlice";

const TaskDialog = ({task}) => {
  const navigate = useNavigate();
  
  const openTaskDetails = () => {
    navigate(`/task/${task._id}`);
  }

  const [open, setOpen] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  const [deleteTask] = useDeleteTaskMutation();
  const [TaskDone] = useDoneTaskMutation();
  
  const deleteClicks = () => {
    setOpenDialog(true)
  }

  const deleteHandler = async() => {
    try{

      const res = await deleteTask({
        _id: task._id,
      }).unwrap();

      toast.success(res?.message);

      setTimeout(() => { 
        setOpenDialog(false)
        window.location.reload()
      }, 200);

    } catch (err){
      console.log(err)
      toast.error(err?.data?.message || err.error)
    }
  };

  const TaskDoneHandler = async() => {
    try{
      const res = await TaskDone({
        _id: task._id,
      }).unwrap();

      toast.success(res?.message);

      setTimeout(() => { 
        window.location.reload()
      }, 200);

    } catch (err){
      console.log(err)
      toast.error(err?.data?.message || err.error)
    }
  }
  
  const items = [
    {
      label: "Open Task",
      icon: <FaFolderOpen className='mr-2 h-5 w-5' aria-hidden='true' />,
      onClick: openTaskDetails,
      disabled: false
    },
    {
      label: "Edit",
      icon: <MdOutlineEdit className='mr-2 h-5 w-5' aria-hidden='true' />,
      onClick: () => setOpenEdit(true),
      disabled: task.status === "Complete"
    },
    {
      label: "Complete",
      icon: <MdDone className='mr-2 h-5 w-5' aria-hidden='true' />,
      onClick: TaskDoneHandler,
      disabled: task.status === "Complete"
    },
  ]

  return (
    <>
      <div>
        <Menu as='div' className='relative inline-block text-left'>
          {/* dialog button*/}
          <Menu.Button className='inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100'>
            <BsThreeDots />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items className='absolute p-4 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'>
              <div className='px-1 py-1 space-y-2'>
                {items.map((el) => (
                  <Menu.Item key={el.label}>
                    {({ active }) => (
                      <button
                        onClick={el.disabled ? null : el?.onClick}
                        className={`${
                            el.disabled ? "cursor-not-allowed  text-gray-400" :
                            active ? "bg-blue-700 text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        {el.icon}
                        {el.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>

              <div className='px-1 py-1'>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => deleteClicks()}
                      className={`${
                        active ? "bg-blue-700 text-white" : "text-red-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      <RiDeleteBin6Line
                        className='mr-2 h-5 w-5 text-red-400'
                        aria-hidden='true'
                      />
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={task}
        key={new Date().getTime()}
      />

      <ConfirmationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      
    </>
  )
}

export default TaskDialog