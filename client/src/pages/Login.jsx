import React, { useEffect } from 'react'
import {useForm} from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Lottie from 'lottie-react'
import { useDispatch, useSelector } from 'react-redux'
import { useLoginMutation, useRegisterMutation } from '../redux/slices/api/authApiSlice'
import { toast } from 'sonner'

import Textbox from '../components/Textbox'
import Button from '../components/Button'
import Loading from '../components/Loader'
import { setCredentials } from '../redux/slices/authSlice'

import loginpageAni from '../assets/loginpageAni.json'


const Login = () => {
  //useSelector to get user from redux
  const {user} = useSelector((state) => state.auth);
  
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  //useForm to handle form
  const { 
    register,
    handleSubmit,
    formState: {errors},
  } = useForm()

  const navigate = useNavigate() //useNavigate to navigate to dashboard
  const dispatch = useDispatch() //useDispatch to dispatch actions

  const [login, {isLoading: isLoginLoading}] = useLoginMutation() //useLoginMutation to login
  const [registerUser, {isLoading: isRegisterLoading}] = useRegisterMutation() //useRegisterMutation to register

  //submit handler for login
  const submitHandler = async (data) => {
    try{
      const result = await login(data).unwrap();
      
      dispatch(setCredentials(result)) //dispatch setCredentials
      navigate('/') //navigate to dashboard

    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.message);
    }
  }

  const registerSubmit = async (data) => {
    try{
      await registerUser(data).unwrap();

      toast.success('User registered successfully')
      setIsRegisterMode(false)

    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.message);
    }
  }

  //useEffect to check if user is logged in
  useEffect(() => { 
    user && navigate('/dashboard')
  }, [user])

  return (
    <>
    <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]'>
      <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center '>
        {/* left side of login page*/}
        <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
          <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
            <span className='flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base border-violet-300 text-gray-600'>
              Collaborative!
              </span>
              <p className='flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-violet-700'>
                <span>Family Management</span>
                <span>System</span>
              </p>

              <div className='cell'> 
                  <Lottie loop={true} animationData={loginpageAni}/>
              </div>
          </div>
        </div>

         {/* right side of login page*/}
        <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center'>
          {!isRegisterMode ? (
          <form onSubmit={handleSubmit(submitHandler)}  //form for login
          className='form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14'
          >
            <div className=''>
              <p className='text-violet-700 text-3xl font-bold text-center'>
                welcome back!
              </p>
              <p className='text-center text-base text-gray-400'>
                Login to your account
              </p>
            </div>
            <div className='flex flex-col gap-y-5'>
              {/*Textbox for email*/}
              <Textbox

                placeholder="Email Address"
                type="email"
                name="email"
                label="Email Address"
                className="w-full"
                register={register("email",{ 
                  required: "Email Address is required",
                })}
                error = {errors.email ? errors.email.message : ""} //error message for email
              />
              {/*Textbox for password*/}
              <Textbox
              
              placeholder="Password"
              type="password"
              name="password"
              label="Password"
              className="w-full"
              register={register("password",{
                required: "password is required",
              })}
              error = {errors.password ? errors.password.message : ""} //error message for password
            />

            {/*Button for submit*/}
            <Button 
              label={isLoginLoading ? (<Loading/>) : 'login'}
              type='submit'
              className='w-full h-10 bg-violet-700 text-white hover:bg-violet-800'
            />
            <span className='text-sm text-gray-500'>New to this?
              <span className='text-sm text-gray-500 hover:text-violet-600 hover:underline cursor-pointer' onClick={() => setIsRegisterMode(true) }> Register now</span>
            </span>

            </div>
          </form>
          ) : (
            <form onSubmit={handleSubmit(registerSubmit)}
            className='form-container w-full md:w-[500px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14'
            >
              <div className=''>
                <p className='text-violet-700 text-3xl font-bold text-center'>
                  Welcome!
                </p>
                <p className='text-center text-base text-gray-400'>
                  Register your account
                </p>
              </div>
              <div className='flex flex-col gap-y-5'>
                <Textbox
                  placeholder="User Name"
                  type="text"
                  name="username"
                  label="User Name"
                  className="w-full"
                  register={register("username",{ 
                    required: "User Name is required",
                  })}
                  error = {errors.name ? errors.name.message : ""}
                />
                <Textbox
                  placeholder="Email Address"
                  type="email"
                  name="email"
                  label="Email Address"
                  className="w-full"
                  register={register("email",{ 
                    required: "Email Address is required",
                  })}
                  error = {errors.email ? errors.email.message : ""}
                />
                <select
                  className="w-full border p-2"
                  {...register("role", {
                      required: "Role is required",
                  })}
                  >
                  <option value="">Select a role...</option>
                  <option value="father">Father</option>
                  <option value="mother">Mother</option>
                  <option value="son">Son</option>
                  <option value="daughter">Daughter</option>
                </select>
                {errors.role && <p className="text-red-500">{errors.role.message}</p>}

                <Textbox
                  placeholder="your password"
                  type="password"
                  name="password"
                  label="password"
                  className="w-full"
                  register={register("password",{
                    required: "password is required",
                  })}
                  error = {errors.password ? errors.password.message : ""}
                />
                <Button 
                  label={isRegisterLoading ? (<Loading/>) : 'register'}
                  type='submit'
                  className='w-full h-10 bg-violet-700 text-white hover:bg-violet-800'
                />
                <span className='text-sm text-gray-500'>Already have an account?
                  <span className='text-sm text-gray-500 hover:text-violet-600 hover:underline cursor-pointer' onClick={() => setIsRegisterMode(false) }> Login now</span>
                </span>
              </div>

            </form>
          )
        }
        </div>

        

      </div>
      
    </div>
    
    </>
  ) 
}  

export default Login