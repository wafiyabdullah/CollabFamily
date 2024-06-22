import React from 'react'
import {useForm} from 'react-hook-form'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import {useUpdateUserMutation} from '../redux/slices/api/userApiSlice'

import ModalWrapper from './ModalWrapper'
import { Dialog } from '@headlessui/react'
import Textbox from './Textbox'
import Button from './Button'
import Loading from './Loader'

const Profile = ({open, setOpen}) => {
    const { user } = useSelector((state) => state.auth);
    const [updateUser, {isLoading}] = useUpdateUserMutation()
    
    const defaultValues = {
        username: user?.username || "",
        email: user?.email || "",
        role: user?.role || "",
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({defaultValues});
    
    const submitHandler = async(data) => {
        try{
            const newData = {
                ...data,
            }

            const res = await updateUser(newData).unwrap();

            toast.success(res.message)

            setTimeout(() => { 
                setOpen(false)
                window.location.reload()
            }, 500);
            
        } catch (error){
            console.log(error)
            toast.error(error?.data?.message || error.message || 'Something went wrong')
        }
    }
  
    return (
        <>
            <ModalWrapper open={open} setOpen={setOpen}>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <Dialog.Title 
                        as='h2'
                        className='text-base font-bold leading-6 text-gray-900 mb-4'
                    >
                        Update Profile
                    </Dialog.Title>
                
                    <div className='mt-2 flex flex-col gap-6'>
                        {/*username  */}
                        <Textbox
                            placeholder='Username'
                            type='text'
                            name='username'
                            label='Username'
                            className='w-full rounded'
                            register={register('username', {required: 'Username is required'})}
                            error={errors.username ? errors.username.message : ''}
                            disable
                        />
                        {/*email  */}
                        <Textbox
                            placeholder='Email'
                            type='email'
                            name='email'
                            label='Email'
                            className='w-full rounded'
                            register={register('email', {required: 'Email is required'})}
                            error={errors.email ? errors.email.message : ''}
                        />
                        {/*role  */}
                        <Textbox
                            placeholder='Role'
                            type='text'
                            name='role'
                            label='Role'
                            className='w-full rounded'
                            register={register('role', {required: 'Role is required'})}
                            error={errors.role ? errors.role.message : ''}
                        />
                    </div>
                    
                        <div className='py-6 sm:flex sm:flex-row-reverse gap-4'>
                        
                        {isLoading ? (
                            <div className=''>
                                <Loading /> 
                            </div>
                        ) : (
                            <>
                                <Button
                                    label='Save'
                                    type='submit'
                                    className='bg-violet-700 px-8 text-sm font-semibold text-white hover:bg-violet-600  sm:w-auto'
                                />
                            </>
                        )}
                            {/*cancel button  */}
                            <Button
                                type='button'
                                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto hover:text-red-500'
                                onClick={() => setOpen(false)}
                                label='Cancel'
                            />
                    </div>
                    
                </form>

            </ModalWrapper>
        </>
  )
}

export default Profile