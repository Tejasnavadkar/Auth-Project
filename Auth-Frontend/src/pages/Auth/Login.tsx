import React, { useState } from 'react'
import CustomInput from '../../components/common/CustomInput'
import { SiFusionauth } from 'react-icons/si'
import { Link } from 'react-router-dom'
import { Button } from 'flowbite-react'

interface LoginInfo {
    name:string,
    password:string,
    rememberMe:boolean
}

const Login = () => {
   const [loginInfo,setLoginInfo] = useState<LoginInfo>({
        name:'',
        password:'',
        rememberMe:false
    })

    const HandleChange = (e) =>{
        
        const {name,value,type,checked} = e.target
        setLoginInfo((prev)=>{
            return {
                ...prev,
                [name]:type === 'checkbox' ? checked : value
            }
        })

    }

    const HandleSubmit = (e) =>{
        e.preventDefault()
        console.log(loginInfo)
    }

    return (
        <div className=' flex flex-col items-center pt-20'>
            <form onSubmit={HandleSubmit} className=' md:w-3/12 flex flex-col gap-4'>
                <div className='flex flex-col my-4 items-center'>
                    <SiFusionauth className="  sm:text-4xl" />
                    <span className=" whitespace-nowrap text-xl font-bold dark:text-white">Login</span>
                </div>
            
                    <CustomInput
                        label='Your Name'
                        className='rounded-md'
                        placeholder={'enter your name'}
                        onChange={HandleChange}
                        name='name'
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
