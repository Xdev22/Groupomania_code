import React from "react";
import Log from "../components/log/index";

const Profil = () => {
  return (
    <div className="profil-page">
      <div className="log-container">
        <Log />
        <div className="img-container">
          <img src="./img/log.svg" alt="img de connexion" />
        </div>
      </div>
    </div>
  );
};

export default Profil;
