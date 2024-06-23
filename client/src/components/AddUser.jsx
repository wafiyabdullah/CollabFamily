//libraries
import React from 'react'
import { useForm } from "react-hook-form";
import { useSelector} from "react-redux";
import { Dialog } from "@headlessui/react";
import { toast } from 'sonner'

//components
import ModalWrapper from "./ModalWrapper";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./Button";

//api 
import { useRegisterFamilyMutation } from '../redux/slices/api/userApiSlice'; 

const AddUser = ({ open, setOpen, userData }) => {
    
    const user = useSelector(state => state.auth.user) 
    const [ registerFamily, {isLoading}] = useRegisterFamilyMutation();

    const{
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const handleOnSubmit = async(data) => {
        try{
          const res = await registerFamily({...data, userId: user._id}).unwrap()
           
           toast.success(res?.message);

          setTimeout(() => { 
            setOpen(false)
            window.location.reload()
          }, 500);

        } catch (err){
            console.log(err)
            toast.error(err?.data?.message || err.error)
        }
    };

  return (
    <>
        <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)}  className=''>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            Add New Family Member
          </Dialog.Title>
          <div className='mt-2 flex flex-col gap-6'>
            <Textbox
              placeholder='Username'
              type='text'
              name='username'
              label='Username'
              className='w-full rounded'
              register={register("username", {
                required: "Username is required!",
              })}
              error={errors.username ? errors.username.message : ""}
            />
            <Textbox
              placeholder='Email Address'
              type='email'
              name='email'
              label='Email Address'
              className='w-full rounded'
              register={register("email", {
                required: "Email Address is required!",
              })}
              error={errors.email ? errors.email.message : ""}
            />

          </div>

            <div className='py-3 mt-4 sm:flex sm:flex-row-reverse'>
              <Button
                label={isLoading? (<Loading/>) : 'Submit'}
                type='submit'
                className='bg-violet-600 px-8 text-sm font-semibold text-white hover:bg-violet-700  sm:w-auto'
                
              />

              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                onClick={() => setOpen(false)}
                label='Cancel'
              />
            </div>
         
        </form>
      </ModalWrapper>
    </>
  )
}

export default AddUser