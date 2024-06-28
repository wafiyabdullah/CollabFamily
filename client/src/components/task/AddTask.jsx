import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

// components
import ModalWrapper from '../ModalWrapper';
import { Dialog } from '@headlessui/react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Textbox from '../Textbox';
import SelectList from '../SelectList';
import Button from '../Button';
import { dateFormatter } from '../../utils/index';
import Loading from '../Loader';

// Redux API
import { useCreateTaskMutation, useUpdateTaskMutation } from '../../redux/slices/api/taskApiSlice';

const LISTS = ["InComplete", "Complete"];
const PRIORITY = ["Low", "Medium", "High"];
const animatedComponents = makeAnimated();

const AddTask = ({ open, setOpen, task, familyMembers = [] }) => {
  const defaultValues = {
    title: task?.title || "",
    description: task?.description || "",
    datelines: dateFormatter(task?.datelines || new Date()),
    status: "",
    priority: "",
    mentioned_user: task?.mentioned_user || [],
  };

  const [status, setStatus] = useState(task?.status || LISTS[0]);
  const [priority, setPriority] = useState(task?.priority || PRIORITY[0]);
  const [selectedOptions, setSelectedOptions] = useState(
    task?.mentioned_user.map(user => ({ value: user._id, label: user.username })) || []
  );
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({ defaultValues });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
      setSelectedOptions(
        task?.mentioned_user.map(user => ({ value: user._id, label: user.username })) || []
      );
    }
  }, [open, task, reset]);

  useEffect(() => {
    setSelectedOptions(task?.mentioned_user.map(user => ({ value: user._id, label: user.username })) || []);
  }, [task]);

  const submitHandler = async (data) => {
    try {
      const newData = {
        ...data,
        status,
        priority,
        mentioned_user: selectedOptions.map(option => option.value),
      };

      const res = task?._id
        ? await updateTask({ ...newData, _id: task._id }).unwrap()
        : await createTask(newData).unwrap();

      toast.success(res.message);

      setTimeout(() => {
        setOpen(false);
        window.location.reload();
      }, 500);

    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const familyMemberOptions = familyMembers.map(member => ({ value: member._id, label: member.username }));

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            {task ? "Update Task" : "Add Task"}
          </Dialog.Title>

          <div className='mt-2 flex flex-col gap-6'>
            {/* title */}
            <Textbox
              placeholder='Task Title'
              type='text'
              name='title'
              label='Task Title'
              className='w-full rounded'
              register={register("title", { required: "title is required" })}
              error={errors.title ? errors.title.message : ""}
            />
            {/* description */}
            <Textbox
              placeholder='Task Description'
              type='text'
              name='description'
              label='Task Description'
              className='w-full rounded'
              register={register("description")}
              error={errors.description ? errors.description.message : ""}
            />
            {/* family members */}
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Family Members
              </label>
              <Select
                options={familyMemberOptions}
                closeMenuOnSelect={false}
                components={animatedComponents}
                placeholder='Assign Family Members'
                value={selectedOptions}
                onChange={setSelectedOptions}
                isMulti
                isDisabled={Boolean(task)}
              />
            </div>
            <div className='flex gap-4'>
              {/* status */}
              <SelectList
                label='Task Status'
                lists={LISTS}
                selected={status}
                setSelected={setStatus}
              />
              {/* due datelines */}
              <div className='w-full'>
                <Textbox
                  placeholder='Datelines'
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
            </div>
            {/* priority level */}
            <div className='flex gap-4'>
              <SelectList
                label='Priority Level'
                lists={PRIORITY}
                selected={priority}
                setSelected={setPriority}
                isDisabled={Boolean(task)}
              />
            </div>
            
            <div className='py-6 sm:flex sm:flex-row-reverse gap-4'>
              {/* submit button */}
              <Button
                label={isLoading || isUpdating ? (<Loading />) : 'Submit'}
                type='submit'
                className='bg-violet-700 px-8 text-sm font-semibold text-white hover:bg-violet-600 sm:w-auto'
                disabled={isLoading || isUpdating}
              />
              {/* cancel button */}
              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto hover:text-red-500'
                onClick={() => setOpen(false)}
                label='Cancel'
              />
            </div>
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddTask;
