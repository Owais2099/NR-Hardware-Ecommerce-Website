const { doubleCsrf } = require("csrf-csrf");

const doubleCsrfOptions = {
  getSecret: () => process.env.CSRF_SECRET,
  cookieOptions: {
    sameSite: process.env.CSRF_COOKIE_SAMESITE,
  },
};

const { generateToken } = doubleCsrf(doubleCsrfOptions);

function addCsrfToken(req, res, next) {
  res.locals.csrfToken = generateToken(req, res);
  next();
}

module.exports = addCsrfToken;
