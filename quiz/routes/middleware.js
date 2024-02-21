const firebaseAdmin = require("firebase-admin");

const ensureSession = (req, res, next) => {
  const sessionCookie = req.cookies.session || '';
  firebaseAdmin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then((decodedClaims) => {
      req.user = decodedClaims;
      return next();
    })
    .catch((error) => {
      console.error('Error verifying session cookie:', error);
      return res.status(401).send('Unauthorized');
    });
};

const ensureAdmin = (req, res, next) => {
  const sessionCookie = req.cookies.session || '';
  firebaseAdmin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then((decodedClaims) => {
      if (decodedClaims.admin) {
        req.user = decodedClaims;
        return next();
      } else {
        return res.status(401).send('Unauthorized');
      }
    })
    .catch((error) => {
      console.error('Error verifying session cookie:', error);
      return res.status(401).send('Unauthorized');
    });
};

const signupReturnData = {
  firstName: 1,
  lastName: 1,
  email: 1,
  createdGame: 1,
  joinedGame: 1,
  _id: 1,
};

const filterUser = (user) => {
  let newUser = {};
  Object.keys(signupReturnData).map((item) => (newUser[item] = user[item]));
  return newUser;
};

const saltRounds = 10;

module.exports = {
  ensureSession,
  ensureAdmin,
  signupReturnData,
  filterUser,
  saltRounds,
};
