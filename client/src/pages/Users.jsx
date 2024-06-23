import React,{ useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'

import { IoMdAdd } from 'react-icons/io'

import Button from '../components/Button'
import Title from '../components/Title'
import { getInitials } from '../utils'
import AddUser from '../components/AddUser'
import { RemoveUser } from '../components/Dialogs'
import Loading from '../components/Loader'

import { useGetFamilyListQuery, useRemoveFamilyMemberMutation } from '../redux/slices/api/userApiSlice'

const Users = () => {
  const user = useSelector(state => state.auth.user)
  
  const [openDialog, setOpenDialog] = useState(false)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)

  const {data, isLoading , refetch} = useGetFamilyListQuery()
  const [removeFamilyMember] = useRemoveFamilyMemberMutation()

  const removeClick = (id) => {
    setSelected(id)
    setOpenDialog(true)
  }

  const removeHandler = async() => {
    try {

      const res = await removeFamilyMember(selected).unwrap()
      toast.success(res.message || "Family member removed successfully")
      setOpenDialog(false)
      refetch()

    } catch (error) { 
      console.error("Error removing family member:", error)
      toast.error( error.data?.message || error.error ||"Error removing family member")
    }
  }
  
  useEffect(() => {
    if (user){
      setLoading(isLoading)
      refetch()
        .then(()=> setLoading(false))
        .catch(error => {
          setLoading(false)
          console.log("Error fetching family members:", error)
        })
    }
  }, [user, refetch])

  // table header which title of each the columns
  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black text-left'>
        <th className='py-2'>Full Name</th>
        <th className='py-2'>Email</th>
        <th className='py-2'>Role</th>
      </tr>
    </thead>
  );

  //all data in table row by row
  const TableRow = ({ user }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
      
      <td className='p-2'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-violet-700 '>
            <span className='text-xs md:text-sm text-center'>
              {getInitials(user.username)}
            </span>
          </div>
          {user.username}
        </div>
      </td>

      <td className='p-2'>{user.email || "user.email.com"}</td>
      <td className='p-2'>{user.role}</td>

      <td className='p-2 flex gap-4 justify-center'> 
            <Button
              className='text-red-700 hover:text-red-500 font-semibold sm:px-0'
              label='Remove'
              type='button'
              onClick={() => removeClick(user?.id)}
            />
      </td>
    </tr>
  )

  return (
    <>
      <div className='w-full md:px-1 px-0 mb-6'>
      {/*family members title and add family button */}
      <div className='flex items-center justify-between mb-8'>
        <Title title=' Family Members'/>
        <Button 
          label='Add Family Member'
          icon={<IoMdAdd className='text-lg'/>}
          className='flex flex-row-reverse gap-1 items-center bg-violet-700 rounded-md text-white py-2 2xl:py-2.5 hover:bg-violet-800'
          onClick={() => setOpen(true)}
        />
      </div>

      {/* layout of family members table*/}
      <div className='w-3/4 bg-white px-2 md:px-4 py-4 rounded shadow'>
        <div className='overflow-x-auto'>
        {isLoading ? (
              <Loading />
            ) : (
          <table className='w-full mb-5'>
            <TableHeader/>

            {/*mapping data from tableRow into layout */}
            <tbody>
              {data?.map((user,index) => (
                <TableRow key={index} user={user} />
              ))}
            </tbody>
          </table>
          )}
        </div>

      </div>
    </div>
    
    <AddUser 
      open={open}
      setOpen={setOpen}
    />
    <RemoveUser 
      open={openDialog}
      setOpen={setOpenDialog}
      onClick={removeHandler}
    />

    </>
  )
     
}

export default Users