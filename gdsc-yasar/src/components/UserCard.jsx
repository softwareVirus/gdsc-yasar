import React from "react";

const UserCard = (props) => {
  console.log(props);
  return (
    <div className="user-card">
      <div className="list-ranking">{props.ranking}</div>
      <div className="list-username">
        <p>{props.user.firstName + " " + props.user.lastName}</p>
      </div>
    </div>
  );
};

export default UserCard;
