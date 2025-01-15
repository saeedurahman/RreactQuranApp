import React from 'react'
import { NavLink } from 'react-router-dom'
import './Headers.css'
// import '../../pages/Home.css'
function Headders() {
  return (
    <header>
                {/* نیو بار */}
                <nav className='container'>
                <NavLink to = '/'>
                    <h1 className='logo'>Read Quran</h1>
                    </NavLink>
                    <ul>
                        <li>
                        <NavLink to = '/'> Home</NavLink>
                        </li>

                        <li>
                        <NavLink to = '/QuranText'>QuranText</NavLink>
                        </li>

                        <li>
                        <NavLink to = '/SearchAyah'>SearchAyah</NavLink>
                        </li>

                        <li>
                        
                        <NavLink to = '/TotalSurah'>TotalSurah</NavLink>
                        </li>
                    </ul>
                </nav>
    </header>
  )
}

export default Headders
