const expressSession = require("express-session");
const MySQLStore = require("express-mysql-session")(expressSession);

function createSessionStore() {
  const store = new MySQLStore({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  return store;
}

function createSessionConfig() {
  return {
    secret: process.env.SESSION_SECRET,
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
