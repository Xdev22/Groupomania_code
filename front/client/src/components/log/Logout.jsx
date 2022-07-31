import React from "react";
import axios from "axios";
import cookie from "js-cookie";

const Logout = () => {
  const removeCookie = (key) => {
    cookie.remove(key, { expires: 1 });
  };

  const logout = () => {
    axios({
      method: "get",
      url: `http://localhost:3000/api/user/auth/logout`,
      withCredentials: true,
    })
      .then(() => {
        removeCookie("jwt");
        window.location = "/profil";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <li onClick={logout}>
      <img src="./img/icons/logout.svg" alt="logout" />
    </li>
  );
};

export default Logout;
