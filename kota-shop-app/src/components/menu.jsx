import React, { Fragment, useState } from "react";
// import useReactRouter from "use-react-router";
import { useLocation, Link } from "react-router-dom";
import { logout } from "../actions/session";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'

function Menu() {
  const [openMenu, setOpenMenu] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    setOpenMenu(false)
    logout()
  }

  return (
    <Fragment>
      <div className={`menu-container menu-container${!openMenu && "--close"}`}>
        <Link
          className={`menu-item-name${openMenu ? "--mobile" : ""}`}
          to="/"
          onClick={() => setOpenMenu(false)}
        >
          <p>KoTa Shop</p>
        </Link>
        {location.pathname !== "/login" && (
          <Link
            className="menu-item menu-item--logout"
            to="/login"
            onClick={handleLogout}
          >
            <p className="menu-item-p">Logout</p>
          </Link>
        )}
      </div>

        <div className="mobile-layout">
          <Link className="mobile-layout-title" to="/">
            <p>KoTa Shop</p>
          </Link>
          {location.pathname !== "/login" && (
            <div
              className="mobile-layout-icon"
              onClick={() => setOpenMenu(!openMenu)}
            >
              <FontAwesomeIcon icon={openMenu ? faTimes : faBars} />
            </div>
           )}
        </div>

    </Fragment>
  );
}

export default Menu;
