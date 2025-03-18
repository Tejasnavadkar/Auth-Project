import React from 'react'

interface InputType{
    label:string,
    onChange:(event: React.ChangeEvent<HTMLInputElement>) => void
    className:string,
    placeholder:string,
    name:string,
    type?:string
    
}

const CustomInput = ({label,onChange,className,placeholder,name,...rest}:InputType) => {
  return (
    <div className='flex flex-col gap-3'>
       <label className='text-sm' htmlFor="">{label}</label> 
      <input 
      type="text" 
      name={name} 
      onChange={onChange} 
      className={className} 
      placeholder={placeholder} 
      {...rest}
      />
    </div>
  )
}

export default CustomInput



// import { z } from 'zod';

// const registerSchema = z.object({
//     username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
//     email: z.string().email({ message: "Invalid email address" }),
//     password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
//     confirm_password: z.string(),
// }).refine((data) => data.password === data.confirm_password, {
//     message: "Passwords do not match",
//     path: ["confirm_password"],
// });

// export default registerSchema;
