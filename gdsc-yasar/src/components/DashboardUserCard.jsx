import React, { memo } from "react";

const DashboardUserCard = memo((props) => {
  console.log(props,"alfa");
  return (
    <div className="dashboard-user-card">
      <div className="user-info">
        <div className="dashboard-list-ranking">{props.ranking}</div>
        <div className="dashboard-list-username">
          <p>{props.user.firstName + " " + props.user.lastName}</p>
        </div>
      </div>
      <div className="dashboard-list-score">{props.score}</div>
    </div>
  );
});

export default DashboardUserCard;
