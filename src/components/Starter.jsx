import {Link } from "react-router-dom";

const Starter = () => {
   
    return (
        <div className="starter">
            <h1>Chat App</h1>
          <Link to='/signup'><button > Let's start</button> </Link>  
            <p>Do you have an account? Sign-in</p>
        </div>
    )
}

export default Starter;