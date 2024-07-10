import { UserContext } from "../UserContext";
import { useContext, useState } from "react";
import "./Home.css";


function Home() {
  const { user } = useContext(UserContext);
  
  return (
    <div className="home">
      <h1>Welcome back, {user.newUser.FirstName}!</h1>
    </div>
  );
}

export default Home;
