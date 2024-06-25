//libraries
import React,{ Fragment, useState } from 'react'
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFolderOpen } from "react-icons/fa";
import { MdDone } from "react-icons/md";
import { Menu, Transition } from "@headlessui/react";
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom';

//components
import AddBill from "./AddBill";
import ConfirmationDialog from "../Dialogs";

//api
import { useDeleteBillMutation, usePaidBillMutation } from "../../redux/slices/api/billApiSlice";

const BillDialog = ({bill}) => {
    const navigate = useNavigate();

    const openBillDetails = () => {
        navigate(`/bill/${bill._id}`);
    }

    const [open, setOpen] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)

    const [deleteBill] = useDeleteBillMutation();
    const [BillPaid] = usePaidBillMutation();

    const deleteClicks = () => { 
        setOpenDialog(true)
    }

    const deleteHandler = async() => {
        try {
            const res = await deleteBill({
                _id: bill._id,
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
    }

    const BillPaidHandler = async() => {
        try{
            const res = await BillPaid({
              _id: bill._id,
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
            label: "Open Bill",
            icon: <FaFolderOpen className='mr-2 h-5 w-5' aria-hidden='true' />,
            onClick: openBillDetails,
            disabled: false
        },
        {
          label: "Edit",
          icon: <MdOutlineEdit className='mr-2 h-5 w-5' aria-hidden='true' />,
          onClick: () => setOpenEdit(true),
          disabled: false
        },
        {
            label: "Paid",
            icon: <MdDone className='mr-2 h-5 w-5' aria-hidden='true' />,
            onClick: BillPaidHandler,
            disabled: bill.status === "Paid"
        }
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
                            onClick={el.disabled? null : el?.onClick}
                            className={`${
                                el.disabled ? "cursor-not-allowed  text-gray-400" :
                                active ? "bg-violet-700 text-white" : "text-gray-900"
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
                            active ? "bg-violet-700 text-white" : "text-red-900"
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

        <AddBill 
            open={openEdit}
            setOpen={setOpenEdit}
            bill={bill}
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

export default BillDialog