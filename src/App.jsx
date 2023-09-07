import React from "react";
import axios from "axios";
import { UserContextProvider } from "./components/UserContext";
import Routes from "./components/Routes";

function App() {

  // https://chatserver-6fpp.onrender.com/
  axios.defaults.baseURL = "https://chatserver-6fpp.onrender.com/";
  axios.defaults.withCredentials = true;


  return (
    <UserContextProvider>
      <Routes/>
    </UserContextProvider>
  );
}

export default App;
 