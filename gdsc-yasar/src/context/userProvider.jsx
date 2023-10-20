import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize the user state from local storage if available
    const storedUser = localStorage.getItem("user");
    return storedUser
      ? JSON.parse(storedUser)
      : { admin: false, username: null, ranking: 0 };
  });

  const updateUser = (newUser) => {
    console.log(newUser);
    setUser({ ...user, ...newUser });
  };

  const clearUser = () => {
    setUser({
      isAdmin: false,
      username: "",
      ranking: 0,
    });
  };
  useEffect(() => {
    // Save the user state to local storage whenever it changes
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);
  return (
    <UserContext.Provider value={{ user, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
