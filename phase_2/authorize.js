function auth(req, res, next) {
    console.log("authenticated");
    next();
}

module.exports = auth;