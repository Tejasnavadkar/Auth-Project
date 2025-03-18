import { Button } from 'flowbite-react'
import React, { useState } from 'react'
import { SiFusionauth } from 'react-icons/si'
import { Link } from 'react-router-dom'
import CustomInput from '../../components/common/CustomInput'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')

  const HandleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setEmail((e.target as HTMLInputElement).value)

  }

  const HandleSubmit = (e) => {
    e.preventDefault()
    console.log('email-',email)

  }

  return (
    <div className=' flex flex-col items-center pt-20'>
      <form onSubmit={HandleSubmit} className=' md:w-3/12 flex flex-col gap-4'>
        <div className='flex flex-col my-4 items-center'>
          <SiFusionauth className="  sm:text-4xl" />
          <span className=" whitespace-nowrap text-xl font-bold dark:text-white">Forgot Password</span>
        </div>

        <CustomInput
          label='Enter Email'
          className='rounded-md'
          placeholder={'enter your Email'}
          onChange={HandleChange}
          name='email'
        />

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
