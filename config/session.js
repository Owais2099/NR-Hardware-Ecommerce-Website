const expressSession = require("express-session");
const MySQLStore = require("express-mysql-session")(expressSession);

function createSessionStore() {
  const store = new MySQLStore({
    host: "localhost",
    database: "nr_hardware",
    user: "root",
    password: "abcde12345",
  });

  return store;
}

function createSessionConfig() {
  return {
    secret: "nr-hardware-super-secret",
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  };
}

module.exports = createSessionConfig;
