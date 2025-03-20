
import { SiFusionauth } from 'react-icons/si'
import CustomInput from '../../components/common/CustomInput'
import { Button } from 'flowbite-react'

const VerifyEmail = () => {

  const HandleChange = () =>{

  }

  return (
      <div className=' flex flex-col items-center pt-20'>
                    <form  className=' md:w-3/12 flex flex-col gap-4'>
                        <div className='flex flex-col my-4 items-center'>
                            <SiFusionauth className="  sm:text-4xl" />
                            <span className=" whitespace-nowrap text-xl font-bold dark:text-white">Find Your Account By Email</span>
                        </div>
                    
                            <CustomInput
                                label='Enter Email'
                                className='rounded-md'
                                placeholder={'Email'}
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
        
                    {/* <div className='mt-4'>
                        <p>Dont have an account?<Link to={'/register'} >SignUp</Link></p>
                    </div> */}
                </div>
  )
}

export default VerifyEmail
