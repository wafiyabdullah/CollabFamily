//libraries
import React, {useState} from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

//components
import ModalWrapper from '../ModalWrapper'
import { Dialog } from '@headlessui/react'
import Textbox from '../Textbox'
import SelectList from '../SelectList'
import Button from '../Button'
import {dateFormatter} from '../../utils/index'
import Loading from '../Loader'

//Redux API
import { useCreateBillMutation, useUpdateBillMutation } from '../../redux/slices/api/billApiSlice'

const LISTS = ["Unpaid","Paid" ]
const PRIORITY = ["Low", "Medium", "High"]

const AddBill = ({open, setOpen, bill}) => {   
    
    const defaultValues = {
        title: bill?.title || "",
        amount: bill?.amount || "",
        datelines: dateFormatter(bill?.datelines || new Date()),
        status: "",
        priority: "",
    }
    
    const [status, setStatus] = useState(bill?.status || LISTS[0]);
    const [priority, setPriority] = useState(bill?.priority || PRIORITY[0]);
    
    const [createBill, { isLoading }] = useCreateBillMutation();
    const [updateBill, { isLoading: isUpdating }] = useUpdateBillMutation();

    const {
        register, 
        handleSubmit, 
        formState: {errors},
    } = useForm({defaultValues})
    
    const submitHandler = async(data) => {
        try{
            const newData = {
                ...data,
                status,
                priority,
            };

            const res = bill?._id
                ? await updateBill({...newData, _id: bill._id}).unwrap()
                : await createBill(newData).unwrap();

            toast.success(res.message);

            setTimeout(() => { 
                setOpen(false)
                window.location.reload()
            }, 500);

        } catch (err){
            console.log(err);
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <>
            <ModalWrapper open={open} setOpen={setOpen}>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <Dialog.Title
                        as='h2'
                        className='text-base font-bold leading-6 text-gray-900 mb-4'
                    >
                        {bill ? "Update Bill" : "Add Bill"}
                    </Dialog.Title>
                
                    <div className='mt-2 flex flex-col gap-6'>
                        {/*title  */}
                        <Textbox 
                        placeholder='Bill Title'
                        type='text'
                        name='title'
                        label= 'Bill Title'
                        className='w-full rounded'
                        register={register("title", {required: "title is required"})}
                        error = {errors.title ? errors.title.message : ""}
                        />
                        {/*amount */}
                        <Textbox
                        placeholder='Amount'
                        type='number'
                        name='amount'
                        label= 'Amount'
                        className='w-full rounded'
                        register={register("amount", {required: "amount is required"})}
                        error = {errors.amount ? errors.amount.message : ""}
                        />
                        <div className='flex gap-4'>
                        {/*status */}
                        <SelectList 
                            label='Bill Status' 
                            lists={LISTS} 
                            selected={status} 
                            setSelected={setStatus}
                        />
                        {/*due datelines*/}
                        <Textbox
                        placeholder='Date'
                        type='date'
                        name='datelines'
                        label='Datelines'
                        className='w-full rounded'
                        register={register("datelines", {
                            required: "Datelines is required!",
                        })}
                        error={errors.datelines ? errors.datelines.message : ""}
                        />
                        </div>
                        {/*priority */}
                        <div className='flex gap-4'>
                        <SelectList
                            label='Priority Level'
                            lists={PRIORITY}
                            selected={priority}
                            setSelected={setPriority}
                        />
                        </div>
                        
                        <div className='py-6 sm:flex sm:flex-row-reverse gap-4'>
                            {/*submit button  */}
                            <Button
                                label={isLoading || isUpdating ? (<Loading/>) : 'Submit'}
                                type='submit'
                                className='bg-violet-700 px-8 text-sm font-semibold text-white hover:bg-violet-600  sm:w-auto'
                            />
                            {/*cancel button  */}
                            <Button
                                type='button'
                                className='bg-white px-5 text-sm font-semibold text-gray-900 hover:text-red-500 sm:w-auto'
                                onClick={() => setOpen(false)}
                                label='Cancel'
                            />
                        </div>
                    </div>
                </form>

            </ModalWrapper>
        
        </>
    )
}

export default AddBill