import React, { useEffect, useState } from 'react'
import { Avatar, Button, Dropdown, Navbar } from 'flowbite-react'
import { SiFusionauth } from "react-icons/si";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
const NavBar = () => {

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate()

  useEffect(()=>{
   const token =  localStorage.getItem('AccessToken')
   setIsAuthenticated(token ? true : false)
  },[])
  console.log('nav')

  const HandleLogout = async () =>{

   const response = await axiosInstance.get(`api/auth/logout`)

    if(response.status == 200){
      localStorage.clear()
      setIsAuthenticated(false)
    }

  }

  

  return (
    <div>
       <Navbar fluid rounded className='border'>
      <Navbar.Brand href="https://flowbite-react.com">
        {/* <img src="/favicon.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" /> */}
        <SiFusionauth className="mr-3  sm:text-2xl" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Auth</span>
      </Navbar.Brand>
      <div className="flex md:order-2">
      {isAuthenticated ? (<>
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">Bonnie Green</span>
            <span className="block truncate text-sm font-medium">name@flowbite.com</span>
          </Dropdown.Header>
          <Dropdown.Item>Dashboard</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Item>Earnings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={()=>HandleLogout()}>Sign out</Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </>): <Button  gradientDuoTone='tealToLime' onClick={()=>navigate('/login')} >Login</Button>}
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="#" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="#">About</Navbar.Link>
        <Navbar.Link href="#">Services</Navbar.Link>
        <Navbar.Link href="#">Pricing</Navbar.Link>
        <Navbar.Link href="#">Contact</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
    </div>
  )
}

export default NavBar
