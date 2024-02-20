export function redirectLocation(user, gameState) {
  console.log(user, gameState);
  return user.email
    ? user._id == gameState.owner
      ? gameState.roomCode
        ? "/admin/panel"
        : "/admin/create_room"
      : gameState.roomCode
      ? gameState.questionTime !== null
        ? "/user/game_room"
        : gameState.currentQuestioNumber > gameState.questions.length
        ? "/user/dashboard"
        : "/user/wait"
      : "/user/join_room"
    : "/login";
}
