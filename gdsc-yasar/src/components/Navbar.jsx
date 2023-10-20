import React from 'react'
import logo from '../assets/image 1.png'
import '../style/Navbar.css'
const Navbar = () => {
  return (
    <div className='navbar-container'>
        <div className='navbar-logo'>
            <img src={logo} alt='logo'/>
            <h3>GDSC YASAR</h3>
        </div>
    </div>
  )
}

export default Navbar