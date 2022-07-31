import React from "react";
import Navbar from "../components/NavBar";
import Log from "../components/log";
import { UidContext } from "../components/AppContext";
import { useContext } from "react";

const Home = () => {
  const uid = useContext(UidContext);

  return <div></div>;
};

export default Home;
