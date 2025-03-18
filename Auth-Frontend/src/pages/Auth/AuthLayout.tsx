
import { Outlet } from 'react-router-dom'  

const AuthLayout = () => {
    // Auth logic 
  return (
    <div>
       <Outlet/>  {/* // coz of Outlet dont need to accept children */}
    </div>
  )
}

export default AuthLayout
