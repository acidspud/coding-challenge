import React, { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { logout } from '@/actions/session'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'

function Menu() {
    const [openMenu, setOpenMenu] = useState(false)
    const location = useLocation()

    const handleLogout = () => {
        setOpenMenu(false)
        logout()
    }

    return (
        <nav className="bg-blue text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50 h-[70px]">
            <Link to="/" className="text-2xl font-bold no-underline text-white" onClick={() => setOpenMenu(false)}>
        KoTa Shop
            </Link>

            {/* Mobile menu button */}
            <div className="md:hidden">
                {location.pathname !== '/login' && (
                    <button onClick={() => setOpenMenu(!openMenu)} className="text-2xl focus:outline-none">
                        <FontAwesomeIcon icon={openMenu ? faTimes : faBars} />
                    </button>
                )}
            </div>

            {/* Desktop menu items */}
            <div className="hidden md:flex items-center space-x-4">
                {location.pathname !== '/login' && (
                    <Link to="/login" onClick={handleLogout} className="text-lg no-underline text-white">
            Logout
                    </Link>
                )}
            </div>

            {/* Mobile menu (hidden by default, shown when openMenu is true) */}
            {openMenu && (
                <div className="md:hidden absolute top-[70px] left-0 w-full bg-blue p-4 shadow-lg">
                    {location.pathname !== '/login' && (
                        <Link to="/login" onClick={handleLogout} className="block text-lg py-2 no-underline text-white">
              Logout
                        </Link>
                    )}
                </div>
            )}
        </nav>
    )
}

export default Menu
