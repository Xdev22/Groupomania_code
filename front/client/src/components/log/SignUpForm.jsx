import React from "react";
import axios from "axios";
import { useState } from "react";

const SignUnForm = () => {
  const [formSignup, setFormSignup] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleSignupChange = (evt) => {
    const { name, value } = evt.target;
    setFormSignup({ ...formSignup, [name]: value });
  };

  const handleRegister = (evt) => {
    evt.preventDefault();
    //Verification du formulaire
    const terms = document.getElementById("terms");
    const firstNameError = document.querySelector(".firstName.error");
    const lastNameError = document.querySelector(".lastName.error");
    const emailError = document.querySelector(".email.error");
    const passwordError = document.querySelector(".password.error");
    const termsError = document.querySelector(".terms.error");

    termsError.innerHTML = "";
    firstNameError.innerHTML = "";
    lastNameError.innerHTML = "";
    emailError.innerHTML = "";
    passwordError.innerHTML = "";

    if (!terms.checked) {
      termsError.innerHTML = "Veuillez acceptez nos conditions générales";
    } else {
      //Requête vers l'api
      axios({
        method: "POST",
        url: `http://localhost:3000/api/user/auth/signup`,
        withCredentials: true,
        data: {
          firstName: formSignup.firstName,
          lastName: formSignup.lastName,
          email: formSignup.email,
          password: formSignup.password,
        },
      })
        .then((res) => {
          console.log(res);
          window.location = "/";
        })
        .catch((err) => {
          let error = err.response.data.message;
          if (error.includes("existe ")) {
            emailError.innerHTML = error;
          }
          if (error.includes("mot de passe")) {
            passwordError.innerHTML = error;
          }

          console.log(err);
        });
    }
  };

  return (
    <form action="" onSubmit={handleRegister} id="sign-up-form">
      <label htmlFor="firstName">Prénom:</label>
      <br />
      <input
        type="text"
        name="firstName"
        id="firstName"
        value={formSignup.firstName}
        onChange={(evt) => handleSignupChange(evt)}
      />
      <div className="firstName error"></div>
      <br />
      <label htmlFor="lastName">Nom:</label>
      <br />
      <input
        type="text"
        name="lastName"
        id="lastName"
        value={formSignup.lastName}
        onChange={(evt) => handleSignupChange(evt)}
      />
      <div className="lastName error"></div>
      <br />
      <label htmlFor="email">Email:</label>
      <br />
      <input
        type="text"
        name="email"
        id="email"
        value={formSignup.email}
        onChange={(evt) => handleSignupChange(evt)}
      />
      <div className="email error"></div>
      <br />
      <label htmlFor="password">Mot de passe:</label>
      <br />
      <input
        type="password"
        name="password"
        id="password"
        value={formSignup.password}
        onChange={(evt) => handleSignupChange(evt)}
      />
      <div className="password error"></div>
      <br />

      <label htmlFor="terms">
        J'accepte les &nbsp;
        <a href="/" target="#">
          conditions générales
        </a>
      </label>
      <input type="checkbox" id="terms" />
      <div className="terms error"></div>
      <br />

      <input type="submit" value={"S'inscrire"} />
    </form>
  );
};

export default SignUnForm;
