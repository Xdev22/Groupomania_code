import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { UidContext } from "./AppContext";
import Logout from "./log/Logout";

const Navbar = () => {
  const uid = useContext(UidContext);
  //pour recuperer les données de l'utilisateur dans redux
  const userData = useSelector((state) => state.userReducer);

  return (
    <nav>
      <div className="nav-container">
        <div className="logo">
          <NavLink to="/">
            <div className="logo">
              <img src="./img/icon.png" alt="icon" />
            </div>
          </NavLink>
        </div>

        <ul>
          <li></li>
          <li className="welcome">
            <NavLink to="/profil">
              <h3>
                bienvenue {userData.firstName}
                {userData.lastName && "." + userData.lastName[0]}
              </h3>
            </NavLink>
          </li>
          <Logout />
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
