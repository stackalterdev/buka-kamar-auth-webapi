var AccountManager = require('buka-kamar-module').managers.auth.AccountManager;
var db = require('../db');
var passport = require('passport');

var JwtStrategy = require('passport-jwt').Strategy;
var JwtExtract = require('passport-jwt').ExtractJwt;

var options = {};
options.jwtFromRequest = JwtExtract.fromAuthHeaderWithScheme("Bearer");
options.secretOrKey = process.env.AUTH_SECRET;

passport.use(new JwtStrategy(options,
    function(jwtPayload, done) {
        return done(null, jwtPayload);
    }
));

module.exports = passport.authenticate('jwt', {
    session: false
});