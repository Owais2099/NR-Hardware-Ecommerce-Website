const { doubleCsrf } = require("csrf-csrf");

const doubleCsrfOptions = {
  getSecret: () => "NRHardwareTopSecretKey",
  cookieOptions: {
    sameSite: "lax",
  },
};

const { generateToken } = doubleCsrf(doubleCsrfOptions);

function addCsrfToken(req, res, next) {
  res.locals.csrfToken = generateToken(req, res);
  next();
};

module.exports = addCsrfToken;