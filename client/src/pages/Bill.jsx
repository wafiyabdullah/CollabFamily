import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

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

const animatedComponents = makeAnimated();

const billSort = [
  { value: 'My bill', label: 'My Bill' },
  { value: 'All', label: 'All' },
  { value: 'ClosestDatelines', label: 'Closest Datelines' },
  { value: 'HighPriority', label: 'High Priority' },
  { value: 'Unpaid', label: 'Unpaid' },
  { value: 'Utilities', label: 'Utilities' },
  { value: 'Loans', label: 'Loans' },
  { value: 'Rent', label: 'Rent' },
  { value: 'Insurance', label: 'Insurance' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Subscriptions', label: 'Subscriptions' },
  { value: 'Others', label: 'Others' },
];

const Bill = () => {
  const params = useParams() // this is for getting the params from the url

  const [isLoading, setIsLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [sortCriteria, setSortCriteria] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const status = params?.status || "" // this is for getting the status from the url

  // API LOGIC START
  const user = useSelector((state) => state.auth.user) // get user from redux store
  const { data, refetch, isFetching } = useGetBillQuery() // fetch data from api

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

  useEffect(() => {
    let sortedBills = [...data?.response?.bills || []];

    if (sortCriteria.length === 0 || sortCriteria.some(criteria => criteria.value === 'All')) {
      // If no criteria or 'All' is selected, show all bills
      setFilteredBills(sortedBills);
      return;
    }

    const criteriaValues = sortCriteria.map(criteria => criteria.value);
    // Filter based on multiple selected criteria
    if (criteriaValues.includes('My bill')) {
      // Filter bills where the logged-in user is mentioned
      sortedBills = sortedBills.filter(bill => bill.mentioned_user.some(u => u._id === user._id));
    }

    if (criteriaValues.includes('ClosestDatelines')) {
      sortedBills = sortedBills.filter(bill => bill.status === 'Unpaid');
      sortedBills.sort((a, b) => new Date(a.datelines) - new Date(b.datelines));
    }

    if (criteriaValues.includes('HighPriority')) {
      sortedBills = sortedBills.filter(bill => bill.priority === 'High');
    }

    if (criteriaValues.includes('Unpaid')) {
      sortedBills = sortedBills.filter(bill => bill.status === 'Unpaid');
    }

    const categoryCriteria = criteriaValues.filter(value => 
      ['Utilities', 'Loans', 'Rent', 'Insurance', 'Transportation', 'Subscriptions', 'Others'].includes(value)
    );

    if (categoryCriteria.length > 0) {
      sortedBills = sortedBills.filter(bill => categoryCriteria.includes(bill.category));
    }

    setFilteredBills(sortedBills);
  }, [sortCriteria, data]);

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
        <Title title={status ? `${status} Bill` : "Manage Bill"} /> {/* "status? `${status} Tasks`: "Tasks" for */}
        <Button
          onClick={() => setOpen(true)}
          label="Create Bill"
          icon={<IoMdAdd className="text-lg" />}
          className="flex flex-row-reverse gap-1 items-center bg-blue-700 text-white rounded-md py-2 2xl:py-2.5 hover:bg-blue-800"
        />
      </div>
      <div className='w-full flex items-center py-4 gap-3'>
        <div className='cursor-default w-24 h-11 bg-green-500 p-2 flex rounded justify-center items-center'>
          <h4 className='text-white '>{statusref.Paid}</h4>
        </div>
        <div className='cursor-default w-24 h-11 bg-red-500 p-2 flex rounded justify-center items-center'>
          <h4 className='text-white '>{statusref.Unpaid}</h4>
        </div>
        <div className='cursor-pointer rounded-full hover:bg-slate-200 p-1 flex justify-center items-center'>
          <IoIosRefresh onClick={refreshPage} />
        </div>
        <div className='ml-auto border border-black'>
          <Select
            components={animatedComponents}
            isMulti
            options={billSort}
            value={sortCriteria}
            onChange={setSortCriteria}
            styles={customStyles}
          />
        </div>
      </div>
      {/* each bill card*/}
      <div>
        {isLoading || isFetching ? (
          <div className='py-10'>
            <Loading />
          </div>
        ) : filteredBills.length === 0 ? (
          <div className='py-10 text-center text-gray-500'>
            There are no bills. Create a bill to get started!
          </div>
        ) : (
          <div className='w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 2xl:gap-4'>
            {
              filteredBills.map((bill, index) => (
                <BillCard key={index} bill={bill} />
              ))
            }
          </div>
        )}
      </div>

      <AddBill open={open} setOpen={setOpen} familyMembers={data?.response?.familyMembers || []} />
    </div>
  )
}

export default Bill
