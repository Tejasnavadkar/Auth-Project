
import React from 'react'
import { Outlet } from 'react-router-dom'
import {NavBar} from './components/index'

const Layout = () => {
    return (
        <div className=" w-[90%] mx-auto pt-10 ">
            <NavBar />
            <Outlet />
        </div>
    )
}

export default Layout
