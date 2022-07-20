import React from "react";
import axios from "axios";
import { useState } from "react";

const SignInForm = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLoginChange = (evt) => {
    const { name, value } = evt.target;
    setForm({ ...form, [name]: value });
  };

  const handleLoginSubmit = (evt) => {
    evt.preventDefault();
    let emailError = document.querySelector(".email.error");
    let passwordError = document.querySelector(".password.error");

    axios({
      method: "post",
      url: `http://localhost:3000/api/user/auth/login`,

      data: {
        email: form.email,
        password: form.password,
      },
    })
      .then((res) => {
        console.log(res);
        // window.location = "/";
      })
      .catch((err) => {
        const error = err.response.data.message;

        if (error.includes("mail")) {
          emailError.innerHTML = err.response.data.message;
          console.log("email");
        } else if (!error.includes("mail")) {
          emailError.innerHTML = "";
        } else if (error.includes("Mot de passe")) {
          passwordError.innerHTML = err.response.data.message;
        } else if (!error.includes("Mot de passe")) {
          passwordError.innerHTML = "";
        }
        console.log(err);
      });
  };

  return (
    <form action="" id="sign-up-form" onSubmit={handleLoginSubmit}>
      <label htmlFor="email">Email:</label>
      <br />
      <input
        type="text"
        name="email"
        id="email"
        value={form.email}
        onChange={(evt) => handleLoginChange(evt)}
      />
      <div className="email error"></div>

      <br />

      <label htmlFor="password">Mot de passe:</label>
      <br />
      <input
        type="password"
        name="password"
        id="password"
        value={form.password}
        onChange={(evt) => handleLoginChange(evt)}
      />
      <div className="password error"></div>

      <br />
      <input type="submit" value="Se connecter" />
    </form>
  );
};

export default SignInForm;
