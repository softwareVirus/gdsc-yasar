import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize the user state from local storage if available
    return {
      _id: null,
      firstName: null,
      lastName: null,
      email: null,
      joinedGame: null,
      createdGame: null,
    };
  });
  console.log(user);
  const updateUser = (newUser) => {
    console.log(newUser);
    setUser({ ...user, ...newUser });
  };

  const clearUser = () => {
    setUser({
      firstName: null,
      lastName: null,
      email: null,
      joinedGame: null,
      createdGame: null,
      _id: null,
    });
  };
  return (
    <UserContext.Provider value={{ user, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
