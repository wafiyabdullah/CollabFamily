import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { IoIosRefresh } from "react-icons/io";
import clsx from 'clsx';

import Title from '../components/Title'
import Loading from '../components/Loader'
import {dateFormatter} from '../utils/index'

import {useGetNotificationsQuery} from '../redux/slices/api/adminApiSlice';

const Admin = () => {
  const user = useSelector(state => state.auth.user)
  const [loading, setLoading] = useState(false)

  const {data, isLoading , refetch} = useGetNotificationsQuery()

  useEffect(() => {
    if (user){
      setLoading(isLoading)
      refetch()
        .then(()=> setLoading(false))
        .catch(error => {
          setLoading(false)
          console.log("Error fetching notifications:", error)
        })
    }
  }, [user, refetch])

  const refreshPage = async () => {
    try {
      await refetch();
      toast.info('Data refreshed');
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };
  //console.log(data)

  // table header which title of each the columns
  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black text-left'>
        <th className='py-2'>Type</th>
        <th className='py-2'>Type Title</th>
        <th className='py-2'>Datelines</th>
        <th className='py-2'>Family ID</th>
        <th className='py-2'>Status</th>
        <th className='py-2'>Sent</th>
        <th className='py-2'>Successful</th>
        <th className='py-2'>Last Updated</th>
      </tr>
    </thead>
  );

  const TableRow = ({ noti }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
      
      <td className='pt-2'>{noti.type}</td>
      <td className='pt-2'>{noti.typeTitle}</td>
      <td className='pt-2'>{dateFormatter(noti.typeDatelines)}</td>
      <td className='pt-2'>{noti.FamilyId}</td>
      <td className={clsx('pt-2', statusNotiColor[noti.status])}>{noti.status}</td>
      <td className='pt-2'>{dateFormatter(noti.sentAt? noti.sentAt : 'null')}</td>
      <td className='pt-2'>{dateFormatter(noti.successfulAt? noti.successfulAt: 'null')}</td>
      <td className='pt-2'>{dateFormatter(noti.updatedAt)}</td>

    </tr>
  )

  const statusNotiColor = {
    'Successful': 'bg-green-100',
    'Waiting': 'bg-yellow-100',
    'Failed': 'bg-red-100',
    'Canceled': 'bg-slate-200'
  }

  const dataHeader = data?.response?.notifications? data.response.notifications : []
  
  return (
    <>
    <div className='w-full'>
      <div className='flex items-center mb-4 gap-3'>
          <Title title={"Welcome Admin"} />   
          <div className='rounded-full hover:bg-slate-200 p-1 flex justify-center items-center'>
            <IoIosRefresh onClick={refreshPage}/>
          </div>  
      </div>

      <div className='w-full bg-white px-2 md:px-4 py-4 rounded shadow'>
        <div className='overflow-x-auto'>
          {isLoading ? (
                <Loading />
              ) : (
            <div className='w-full'>
              <Title title='Notifications' className='pb-3'/>
              <table className='w-full mb-1 border'>
                <TableHeader/>
                {/*mapping data from tableRow into layout */}
                <tbody>
                  {dataHeader.map((noti,index) => (
                    <TableRow key={index} noti={noti} />
                  ))}
                </tbody>
              </table>
            </div>
            
            )}
          </div>
      </div>

    </div>
    </>
  )
}

export default Admin