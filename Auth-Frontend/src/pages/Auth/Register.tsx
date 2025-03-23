import React, { useState } from 'react'
import { SiFusionauth } from 'react-icons/si'
import CustomInput from '../../components/common/CustomInput'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'flowbite-react'
import { registerSchema } from '../../config.ts/RegisterSchema'
import axiosInstance from '../../axiosConfig'

interface errorTypes {

  userName?: string[] | undefined,
  email?: string[] | undefined,
  password?: string[] | undefined,
  confirmPassword?: string[] | undefined,

}

const Register = () => {

  const [registerInfo, setRegisterInfo] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',

  })

  const [errors, setErrors] = useState<errorTypes>({})
  const navigate = useNavigate()

  const HandleChange = (e:React.ChangeEvent<HTMLInputElement>) => {

    const { name, value } = e.target
    // console.log(name, value)
    setRegisterInfo((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })

  }

  const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { success, error, data } = registerSchema.safeParse(registerInfo)

    if (!success) {
      // console.log('error',error.formErrors.fieldErrors)
      const formattedErrors: errorTypes = {
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
try {
  
  const payloadBody: { username: string; email: string; password: string; } = {
    username: data.userName,
    email: data.email,
    password: data.password,

  }
 console.log('hii')
 const response = await axiosInstance.post(`/api/auth/register`,payloadBody)
 
 // handlw response here
 if(response.status === 201){
    localStorage.setItem('AccessToken',response.data.user.refreshToken)
    navigate('/verifyotp')
 }
 
} catch (error:any) {
  alert(`${error.response.data.message}`)
}

// response 
//    {
//     "error": false,
//     "user": {
//         "_id": "67dfe7117e8fd9630c22f78d",
//         "username": "aditya",
//         "email": "adi@gmail.com",
//         "password": "$2b$10$74thIYCYJ86IqDXVIDLc1e4jVYyKn97cN/9MtkaKFEiMdAX/ZHrdO",
//         "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkaUBnbWFpbC5jb20iLCJpYXQiOjE3NDI3MjY5MjksImV4cCI6MTc0MzMzMTcyOX0.jWs-pOMw0_qXMGStzlfmX0uJamw69YlZPlE3fYZ36RA",
//         "email_Verified": false,
//         "phoneNumber_Verified": false,
//         "role": "user",
//         "__v": 0,
//         "otp": "984972"
//     }
// }


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
            // registerInfo={registerInfo}
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
