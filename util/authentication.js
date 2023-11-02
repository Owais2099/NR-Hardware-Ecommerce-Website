function createUserSession(req, user, action) {
  req.session.uid = user.id.toString();
  req.session.isAdmin = user.isAdmin;
  req.session.save(action);
}

function destroyUserAuthSession(req, callback) {
  req.session.destroy(function (err) {
    if (callback) {
      callback(err);
    }
  });
}

module.exports = {
  createUserSession: createUserSession,
  destroyUserAuthSession: destroyUserAuthSession,
};
