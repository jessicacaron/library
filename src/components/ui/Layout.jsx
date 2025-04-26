import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Nav from './Nav'


const Layout = ({ books }) => {
  return (
    <div className="layout-main">
        <nav>
        <Nav books={books} />
        </nav>
        <main>
            <Outlet />
        </main>
        <footer>
            <Footer></Footer>
        </footer>
    </div>
  )
}

export default Layout