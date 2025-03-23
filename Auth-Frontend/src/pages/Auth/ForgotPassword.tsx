import { Button } from 'flowbite-react'
import React, { useState } from 'react'
import { SiFusionauth } from 'react-icons/si'
import { Link, useNavigate } from 'react-router-dom'
import CustomInput from '../../components/common/CustomInput'
import axiosInstance from '../../axiosConfig'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState('')
  const navigate = useNavigate()

  const HandleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setEmail((e.target as HTMLInputElement).value)

  }

  const HandleSubmit = async (e) => {
    e.preventDefault()
    console.log('email-', email)
    try {

      const payload = {
        email: email
      }

      const response = await axiosInstance.post(`/api/auth/forget-password`, payload)

      if (response.status === 201) {
        return navigate('/reset-password')
      }

    } catch (error: any) {
      setErrors(error.response.data.message)
    }

  }

  return (
    <div className=' flex flex-col items-center pt-20'>
      <form onSubmit={HandleSubmit} className=' md:w-3/12 flex flex-col gap-4'>
        <div className='flex flex-col my-4 items-center'>
          <SiFusionauth className="  sm:text-4xl" />
          <span className=" whitespace-nowrap text-xl font-bold dark:text-white">Forgot Password</span>
        </div>

        <div>
          <CustomInput
            label='Enter Email'
            className='rounded-md'
            placeholder={'enter your Email'}
            onChange={HandleChange}
            name='email'
          />
          <span className='text-xm text-red-900'>{errors && errors}</span>
        </div>


        <div>
          <Button
            type='submit'
            // onClick={()=>console.log(loginInfo)} 
            className='w-full'
          >Submit</Button>
        </div>
        {/* <button>submit</button> */}
      </form>

      <div className='mt-4'>
        <p><Link to={'/login'} >Back</Link></p>
      </div>
    </div>
  )
}

export default ForgotPassword
