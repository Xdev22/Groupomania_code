import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { UidContext } from "./components/AppContext";
import { useState, useEffect } from "react";
import axios from "axios";
import Home from "./pages/Home";
import Profil from "./pages/Profil";
import { useDispatch } from "react-redux";
import { getUser } from "./actions/user.actions";
import Navbar from "./components/NavBar";
import LeftNav from "./components/LeftNav";

const App = () => {
  //hooks
  //Stock l'user Id
  const [uid, setUid] = useState(null);
  //Permet de declancher une action
  const dispatch = useDispatch();

  useEffect(() => {
    const getToken = async () => {
      await axios({
        method: "get",
        url: "http://localhost:3000/api/user/jwt",
        withCredentials: true,
      })
        .then((res) => {
          setUid(res.data);
        })
        .catch((err) => {
          console.log("No token");
        });
    };
    getToken();
    //si il y a un uid on lance l'action pour recuperer les infos de l'users
    if (uid) dispatch(getUser(uid));
  });

  return (
    <div>
      <UidContext.Provider value={uid}>
        {uid && (
          <>
            <Navbar />
          </>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </UidContext.Provider>
    </div>
  );
};

export default App;
