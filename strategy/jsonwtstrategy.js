const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const key = require('../setup/mongoose-connection').secret
const Person = require('mongoose').model('people');

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key;

module.exports = passport =>{
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        Person.findById(jwt_payload.id, function(err, user) {
            console.log(jwt_payload.id);
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                console.log("null user");
                return done(null, false);
                // or you could create a new account
            }
        });
    }))
}
