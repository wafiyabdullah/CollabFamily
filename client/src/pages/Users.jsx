import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

import { IoMdAdd } from 'react-icons/io';

import Button from '../components/Button';
import Title from '../components/Title';
import { getInitials } from '../utils';
import AddUser from '../components/AddUser';
import { RemoveUser } from '../components/Dialogs';
import Loading from '../components/Loader';
import { IoMdClose } from "react-icons/io";

import {
  useGetFamilyListQuery,
  useRemoveFamilyMemberMutation,
} from '../redux/slices/api/userApiSlice';

const Users = () => {
  const user = useSelector((state) => state.auth.user);

  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data, isLoading, refetch } = useGetFamilyListQuery();
  const [removeFamilyMember] = useRemoveFamilyMemberMutation();

  const removeClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const removeHandler = async () => {
    try {
      const res = await removeFamilyMember(selected).unwrap();
      toast.success(res.message || 'Family member removed successfully');
      setOpenDialog(false);
      refetch();
    } catch (error) {
      console.error('Error removing family member:', error);
      toast.error(error.data?.message || error.error || 'Error removing family member');
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(isLoading);
      refetch()
        .then(() => setLoading(false))
        .catch((error) => {
          setLoading(false);
          console.log('Error fetching family members:', error);
        });
    }
  }, [user, refetch]);

  // Profile card for each user
  const ProfileCard = ({ user }) => (
    <div className="w-full md:w-full bg-white p-3 mb-4 shadow rounded">
      <div className="flex justify-end items-center mb-2">
        <Button
          className="text-white hover:bg-red-600 font-semibold rounded-full bg-red-400 px-3 py-3 "
          label={<IoMdClose />}
          type="button"
          onClick={() => removeClick(user?.id)} // Correct usage of removeClick
        />
      </div>
      <h3 className="text-lg font-semibold text-center">{user.username}</h3>
      <div className='flex justify-center items-center'>{user.role}</div>
      <div className='flex justify-center items-center mb-3'>{user.email}</div>
      <table className="w-full">
        <tbody>
          <tr className="font-bold">
            <td></td>
            <td className='text-center'>Total</td>
          </tr>
          <tr className='border-t'>
            <td className="border-gray-300 font-bold py-2">Assigned Task</td>
            <td className="border-gray-300 text-center py-2">
              <div className="rounded-full bg-slate-200">{user.taskCount}</div>
            </td>
          </tr>
          <tr>
            <td className="py-2">Complete Tasks</td>
            <td className='text-center py-2'>
              <div className="rounded-full bg-green-200">{user.completeTaskCount}</div>
            </td>
          </tr>
          <tr>
            <td className="py-2">Incomplete Tasks</td>
            <td className='text-center py-2'>
              <div className="rounded-full bg-red-200">{user.incompleteTaskCount}</div>
            </td>
          </tr>
          <tr className="border-t border-gray-300">
            <td className="border-gray-300 font-bold py-2">Assigned Bill</td>
            <td className="border-gray-300 text-center py-2">
              <div className="rounded-full bg-slate-200">{user.billCount}</div>
            </td>
          </tr>
          <tr>
            <td className="py-2">Paid Bills</td>
            <td className='text-center py-2'>
              <div className="rounded-full bg-green-200">{user.paidBillCount}</div>
            </td>
          </tr>
          <tr>
            <td className="py-2">Unpaid Bills</td>
            <td className='text-center py-2'>
              <div className="rounded-full bg-red-200">{user.unpaidBillCount}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <div className="w-full md:px-1 px-0 mb-6">
        {/* Family members title and add family button */}
        <div className="flex items-center justify-between mb-8">
          <Title title="Family Members" />
          <Button
            label="Add Family Member"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-700 rounded-md text-white py-2 2xl:py-2.5 hover:bg-blue-800"
            onClick={() => setOpen(true)}
          />
        </div>

        {/* Profile cards section */}
        {isLoading ? <Loading /> :
        <div className="w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 2xl:gap-4">
          {data?.response?.map((user, index) => (
            <ProfileCard key={`${index}-profile`} user={user} />
          ))}
        </div>}
      </div>

      <AddUser open={open} setOpen={setOpen} />
      <RemoveUser open={openDialog} setOpen={setOpenDialog} onClick={removeHandler} />
    </>
  );
};

export default Users;
