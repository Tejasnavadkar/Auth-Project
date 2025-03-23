import {useState } from 'react'
import { SiFusionauth } from 'react-icons/si'
import CustomInput from '../../components/common/CustomInput'
import { Button } from 'flowbite-react'
import axiosInstance from '../../axiosConfig'
import { useLocation, useNavigate } from 'react-router-dom'
// import { useParams } from 'react-router-dom'

const ResetPassword = () => {
//   const { token } = useParams<{ token: string }>()
const [error,setError] = useState<{fieldError:string,responseError:string}>({
    fieldError:'',
    responseError:''
})
 const [password,setPassword] = useState('')
 const [confirmPassword,setConfirmPassword] = useState('')
 const data = useLocation()

 const token = data.search.split('=')[1]
 localStorage.setItem('AccessToken',token)
 const navigate = useNavigate()

const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault()
    
    try {
        if(password !== confirmPassword){
            return setError(prev=>{
               return {
                 ...prev,
                fieldError:'password and confirm password should be same'
               }
            })
        }
        const payload = {
            password:password
        }
    
      const response = await axiosInstance.post(`/api/auth/reset-password`,payload)
    
      if(response.status === 200){
        alert(`${response.data.msg}`)
        navigate('/')
      }
    } catch (error:any) {
        setError(prev=>{
            return {
                ...prev,
                responseError:error.response.data.message
            }
        })
    }



}
  
  return (
     <div className=' flex flex-col items-center pt-20'>
                <form onSubmit={handleSubmit}  className=' md:w-3/12 flex flex-col gap-4'>
                    <div className='flex flex-col my-4 items-center'>
                        <SiFusionauth className="  sm:text-4xl" />
                        <span className=" whitespace-nowrap text-xl font-bold dark:text-white">Reset Password</span>
                    </div>
                    <p className='text-sm text-red-900'>{error.responseError && error.responseError}</p>
                        <CustomInput
                            label='Password'
                            className='rounded-md'
                            placeholder={'password'}
                            onChange={(e)=>setPassword(e.target.value)}
                            name='password'
                        />
                        <CustomInput
                            label='Confirm Password'
                            className='rounded-md'
                            placeholder={' password'}
                            onChange={(e)=>setConfirmPassword(e.target.value)}
                            name='reset password'
                            type={'password'}
                        />
                        
                        <p className='text-sm text-red-900'>{error.fieldError && error.fieldError}</p>
                  
                    <div>
                        <Button 
                        type='submit'
                        // onClick={()=>handleSubmit} 
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
