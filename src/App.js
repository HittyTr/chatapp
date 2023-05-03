import React,{useContext} from "react";
import { Routes, Route } from "react-router-dom";
import Starter from "./components/Starter";
import Home from "./components/Home";
import { UserContext } from "./contexts/UserContext";
import { Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import'bootstrap/dist/css/bootstrap.min.css';
import Profile from "./components/Profile";

function App() {
  const { user } = useContext(UserContext);
  const RequireAuth = ({ children }) => {
    return user ? children : <Navigate to="/" />;
  }

  const RequireUnAuth = ({ children }) => {
    return !user ? children : <Navigate to="/home" />;
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<RequireUnAuth><Starter /></RequireUnAuth>} />
        <Route path='/signup' element={<Signup/>}/>
        <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
      </Routes>
    </div>
  );
}

export default App;
