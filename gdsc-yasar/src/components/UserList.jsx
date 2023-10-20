import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import UserCard from "./UserCard";
import { nanoid } from 'nanoid'
import { useGame } from "../context/gameProvider";
import '../style/User.css'
const UserList = () => {
  const { gameState } = useGame();
  const [list, setList] = useState(gameState.dashboard);
    console.log(list)
  useEffect(() => {
    socket.on("updateDashboard", (data) => {
        console.log(data)
      setList(data);
    });
  }, []);
  return (
    <div className="list-container">
      <div className="list-header">
        <div className="list-ranking">Ranking</div>
        <div className="list-username">Username</div>
      </div>
      <div className="user-container">
        {list.map((item, index) => {
          return <UserCard ranking={item.ranking} username={item.username} key={nanoid()}/>;
        })}
      </div>
    </div>
  );
};

export default UserList;
