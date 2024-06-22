import React from 'react'
import {useForm} from 'react-hook-form'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import ModalWrapper from './ModalWrapper'
import { Dialog } from '@headlessui/react'
import Textbox from './Textbox'
import Button from './Button'
import Loading from './Loader'
import { useChangePasswordMutation } from '../redux/slices/api/userApiSlice'

const ChangePassword = ({open, setOpen}) => {
    const { user } = useSelector((state) => state.auth);
    const [changeUserPassword, {isLoading}] = useChangePasswordMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const submitHandler = async(data) => {
        if (data.password !== data.cpass){
            toast.error("Passwords do not match")
            return
        }

        try{
            const res = await changeUserPassword(data).unwrap();
            toast.success(res.message)
           
            setTimeout(() => { 
                setOpen(false)
                window.location.reload(); //reload window
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
                    Change Password
                </Dialog.Title>
                <div className='mt-2 flex flex-col gap-6'>
                    <Textbox
                        placeholder='Current Password'
                        type='password'
                        name='currentPassword'
                        label='Current Password'
                        className='w-full rounded'
                        register={register('currentPassword', {required: 'Current Password is required'})}
                        error={errors.currentPassword? errors.currentPassword.message : ""}
                    />
                    <Textbox 
                        placeholder='New Password'
                        type='password'
                        name='password'
                        label='New Password'
                        className='w-full rounded'
                        register={register('password', {required: 'New Password is required'})}
                        error={errors.password? errors.password.message : ""}
                    />
                    <Textbox 
                        placeholder='Confirm New Password'
                        type='password'
                        name='cpass'
                        label='Confirm New Password'
                        className='w-full rounded'
                        register={register('cpass', {required: 'Confirm New Password is required'})}
                        error={errors.cpass? errors.cpass.message : ""}
                    />
                </div>
                <div className='py-6 sm:flex sm:flex-row-reverse gap-4'>
                            { isLoading ? (
                                <div>
                                    <Loading />
                                </div>
                            ) : (
                            <>
                            {/*save button  */}
                            <Button
                                label='Save'
                                type='submit'
                                className='bg-violet-700 px-8 text-sm font-semibold text-white hover:bg-violet-600  sm:w-auto'
                            />
                            {/*cancel button  */}
                            <Button
                                type='button'
                                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto hover:text-red-500'
                                onClick={() => setOpen(false)}
                                label='Cancel'
                            />
                            </>
                            )}
                    </div>

            </form>

        </ModalWrapper>
    </>
  )
}

export default ChangePassword