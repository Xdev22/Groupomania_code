import React from "react";
import Log from "../components/log/index";
import { UidContext } from "../components/AppContext";
import { useContext } from "react";
import UpdateProfil from "../components/profil/UpdateProfil";

const Profil = () => {
  const uid = useContext(UidContext);

  return (
    <div className="profil-page">
      {uid ? (
        <UpdateProfil />
      ) : (
        <div className="log-container">
          <Log />
          <div className="img-container">
            <img src="./img/log.svg" alt="img de connexion" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profil;
