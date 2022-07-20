import React from "react";

import { useState } from "react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

const Log = () => {
  //Hooks
  const [signInModal, setSignInModal] = useState(true);
  const [signUpModal, setSignUpModal] = useState(false);

  //Fonction d'affichage du formulaire signup ou signin
  const handleModal = (e) => {
    if (e.target.id === "login") {
      setSignInModal(true);
      setSignUpModal(false);
    } else if (e.target.id === "register") {
      setSignInModal(false);
      setSignUpModal(true);
    }
  };

  return (
    <div className="connection-form">
      <div className="form-container">
        <ul>
          <li
            onClick={handleModal}
            id="login"
            className={signInModal ? "active-btn" : undefined}
          >
            Connexion
          </li>

          <li
            onClick={handleModal}
            id="register"
            className={signUpModal ? "active-btn" : undefined}
          >
            Inscription
          </li>
        </ul>
        {signInModal && <SignInForm />}
        {signUpModal && <SignUpForm />}
      </div>
    </div>
  );
};

export default Log;
