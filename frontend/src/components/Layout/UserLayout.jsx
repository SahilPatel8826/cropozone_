import React from 'react'
import Header from '../Common/Header'
import Navbar from '../Common/Navbar'
import Footer from '../Common/Footer'
import { Outlet, useLocation } from 'react-router-dom'
const UserLayout = () => {
  const { pathname } = useLocation()
  return (
    <div>
        <Header/>
        <main key={pathname} className='page-enter'>
          <Outlet/>
        </main>
        <Footer/>
    </div>
  )
}
 
export default UserLayout