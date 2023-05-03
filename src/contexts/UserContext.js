import React, { createContext,useEffect,useReducer } from 'react';
import {userReducer} from '../reducers/UserReducer';
import { onAuthStateChanged } from 'firebase/auth';

const INITIAL_STATE = {
    currentUser: JSON.parse(localStorage.getItem('user')) || null,
};

export const UserContext = createContext(INITIAL_STATE);

export const UserProvider = ({ children }) => {
const [state, dispatch] = useReducer(userReducer, INITIAL_STATE);

useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.currentUser));
}, [state.currentUser]);

    return (
        <UserContext.Provider value={{user:state.currentUser, dispatch}}>
            {children}
        </UserContext.Provider>
    );
}

