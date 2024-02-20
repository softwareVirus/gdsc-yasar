const signupReturnData = {
  firstName: 1,
  lastName: 1,
  email: 1,
  createdGame: 1,
  joinedGame: 1,
  _id: 1,
};

const saltRounds = 10;

const filterUser = (user) => {
  // return user data according to signupReturnData object properties
  let newUser = {};
  Object.keys(signupReturnData).map((item) => (newUser[item] = user[item]));
  return newUser;
};

function ensureSession(req, res, next) {
  console.log(req.user, req.isAuthenticated(), req.session, req.isAuthenticated);
  if (req.isAuthenticated && req.isAuthenticated()) return next();

  return res.send(401, "Unauthorized");
}

function ensureAdmin(req, res, next) {
  console.log(req.user, req.isAuthenticated(), req.session);
  if (req.isAuthenticated && req.isAuthenticated() && req.user.isAdmin)
    return next();

  return res.send(401, "Unauthorized");
}

module.exports = {
  ensureSession,
  ensureAdmin,
  signupReturnData,
  filterUser,
  saltRounds,
};
