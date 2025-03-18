import React, { useState } from 'react'
import { SiFusionauth } from 'react-icons/si'
import CustomInput from '../../components/common/CustomInput'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from 'flowbite-react'
import { registerSchema } from '../../config.ts/RegisterSchema'

const Register = () => {

  const [registerInfo, setRegisterInfo] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',

  })

  const [errors, setErrors] = useState({})

  const HandleChange = (e) => {




    const { name, value } = e.target
    console.log(name, value)
    setRegisterInfo((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })

  }

  const HandleSubmit = (e) => {
    e.preventDefault()
    const { success, error, data } = registerSchema.safeParse(registerInfo)

    if (!success) {
      // console.log('error',error.formErrors.fieldErrors)
      const formattedErrors = {
        userName: error?.formErrors.fieldErrors.userName,
        email: error?.formErrors.fieldErrors.email,
        password: error?.formErrors.fieldErrors.password,
        confirmPassword: error?.formErrors.fieldErrors.confirmPassword,
      }

      setErrors(formattedErrors)
      console.log(error?.formErrors.fieldErrors)
      return
    }
    console.log("data", data)
    // apicall 



  }
  return (
    <div className=' flex flex-col items-center pt-20'>
      <form onSubmit={HandleSubmit} className=' md:w-3/12 flex flex-col gap-4'>
        <div className='flex flex-col my-4 items-center'>
          <SiFusionauth className="  sm:text-4xl" />
          <span className=" whitespace-nowrap text-xl font-bold dark:text-white">Register</span>
        </div>

        <div>
          <CustomInput
            label='User Name'
            className='rounded-md'
            placeholder={'enter your name'}
            onChange={HandleChange}
            name='userName'
          />
          {errors?.userName && <span className='text-sm text-red-800'>{errors?.userName[0]}</span>}
        </div>
        {/* <span>hi</span> */}
        <div>
          <CustomInput
            label='Email'
            className='rounded-md'
            placeholder={'enter password'}
            onChange={HandleChange}
            name='email'
            type='email'
            // required
          />
          {errors?.email && <span className='text-sm text-red-800'>{errors?.email[0]}</span>}
        </div>

        <div>
          <CustomInput
            label='Password'
            type='password'
            className='rounded-md'
            placeholder={'enter your name'}
            onChange={HandleChange}
            name='password'
          />
          {errors?.password && <span className='text-sm text-red-800'>{errors?.password[0]}</span>}

        </div>
        <div>
          <CustomInput
            label='Confirm Password'
            type='password'
            className='rounded-md'
            placeholder={'enter your name'}
            onChange={HandleChange}
            value={registerInfo.confirmPassword}
            name='confirmPassword'
          />
          {errors?.confirmPassword && <span className='text-sm text-red-800'>{errors?.confirmPassword[0]}</span>}
        </div>

        <div>
          <Button
            type='submit'
            className='w-full'
          >Submit</Button>
        </div>
      </form>
      <div>
        <p>Already have an account?<Link to={'/login'} >SignIn</Link></p>
      </div>
    </div>
  )
}

export default Register
