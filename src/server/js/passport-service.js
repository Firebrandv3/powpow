/**
* Studiengang: MultimediaTechnology / FHS
* Zweck: Web (Basisqualifikationen)
* Autor: Erfan Ebrahimnia
*/

var config = require('config');
var TwitterStrategy = require('passport-twitter').Strategy;

// load up the user model
var orm = require('sequelize-connect');


module.exports = function(passport) {
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        orm.models.User.findById(user.id).then(function(user) {
            done(null, user);
        })
        .catch(function(err) {
            done(err);
        });
    });

    // Twitter OAuth login
    passport.use(new TwitterStrategy({
        
        consumerKey: config.get('auth.twitter.consumerKey'),
        consumerSecret: config.get('auth.twitter.consumerSecret'),
        callbackURL: config.get('auth.twitter.callbackURL')

    }, function(token, tokenSecret, profile, done) {
        // make the code asynchronous
        // orm.models.User.findOrCreate won't fire until we have all our data back from Twitter
        process.nextTick(function() {
            orm.models.User.findOrCreate({ 
                where: { twitterId: profile.id },
                defaults: {
                    name: profile.displayName,
                    twitterId: profile.id,
                    twitterAccessToken: token,
                    avatar: profile.photos[0].value
                }
            })
            .spread(function(user) {
                done(null, user.toJSON());
            })
            .catch(function(err) {
                done(err);
            });
        }); 
    }));
};
