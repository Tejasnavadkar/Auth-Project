import React, { useEffect } from 'react'
import { SiFusionauth } from 'react-icons/si'
import CustomInput from '../../components/common/CustomInput'
import { Button } from 'flowbite-react'
import { useParams } from 'react-router-dom'

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>()
  useEffect(()=>{
    console.log('token', token)
  }, [token])
  const HandleChange = () =>{

  }
  return (
     <div className=' flex flex-col items-center pt-20'>
                <form  className=' md:w-3/12 flex flex-col gap-4'>
                    <div className='flex flex-col my-4 items-center'>
                        <SiFusionauth className="  sm:text-4xl" />
                        <span className=" whitespace-nowrap text-xl font-bold dark:text-white">Reset Password</span>
                    </div>
                
                        <CustomInput
                            label='Password'
                            className='rounded-md'
                            placeholder={'password'}
                            onChange={HandleChange}
                            name='password'
                        />
                        <CustomInput
                            label='Confirm Password'
                            className='rounded-md'
                            placeholder={' password'}
                            onChange={HandleChange}
                            name='reset password'
                            type={'password'}
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
    
                {/* <div className='mt-4'>
                    <p>Dont have an account?<Link to={'/register'} >SignUp</Link></p>
                </div> */}
            </div>
  )
}

export default ResetPassword
