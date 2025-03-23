import React, { useState } from 'react'
import CustomInput from '../../components/common/CustomInput'
import { SiFusionauth } from 'react-icons/si'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'flowbite-react'
import axiosInstance from '../../axiosConfig'

interface LoginInfo {
    email:string,
    password:string,
    rememberMe:boolean
}
// interface handleChange {
//     target:{
//         name:string,
//         value:string,
//         type:string,
//         checked:string
//     }
// }

const Login = () => {
   const [loginInfo,setLoginInfo] = useState<LoginInfo>({
        email:'',
        password:'',
        rememberMe:false
    })

   const navigate = useNavigate()

    const HandleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        
        const {name,value,type,checked} = e.target
        setLoginInfo((prev)=>{
            return {
                ...prev,
                [name]:type === 'checkbox' ? checked : value
            }
        })

    }

    const HandleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(loginInfo)
       try {
        const payloadBody:Omit<LoginInfo,'rememberMe'> = {
            email:loginInfo.email,
            password:loginInfo.password
        }

       const response = await axiosInstance.post(`/api/auth/login`,payloadBody)

       if(response.status === 201){
        localStorage.setItem('AccessToken',response.data.AccessToken)
        localStorage.setItem('refreshToken',response.data.refreshToken)
        return navigate('/')
       }
       } catch (error:any) {
        console.error('err while lohin',error)
        throw new Error(error)
       }
    }

    return (
        <div className=' flex flex-col items-center pt-20'>
            <form onSubmit={HandleSubmit} className=' md:w-3/12 flex flex-col gap-4'>
                <div className='flex flex-col my-4 items-center'>
                    <SiFusionauth className="  sm:text-4xl" />
                    <span className=" whitespace-nowrap text-xl font-bold dark:text-white">Login</span>
                </div>
            
                    <CustomInput
                        label='Email'
                        className='rounded-md'
                        placeholder={'enter your email'}
                        onChange={HandleChange}
                        name='email'
                        type='email'
                    />
                    <CustomInput
                        label='Password'
                        className='rounded-md'
                        placeholder={'enter password'}
                        onChange={HandleChange}
                        name='password'
                        type={'password'}
                    />
                
                <div className='flex  justify-between '>
                    <div className='flex items-center gap-1'>
                        <input onChange={HandleChange} type="checkbox" name="rememberMe" id="choice" className='rounded md:p-1 '  />
                        <label className='text-xs lg:text-base' htmlFor="choice">Remember me</label>
                    </div>
                    <Link className='text-xs lg:text-base' to={'/forgotpassword'}>Forget Password</Link>
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
                <p>Dont have an account?<Link to={'/register'} >SignUp</Link></p>
            </div>
        </div>
    )
}

export default Login
