var _ = require('underscore');
var config = require('config');
var orm = require('sequelize-connect');

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}

module.exports = function(app, passport) {
    app.use(function(req, res, next) {
        res.locals.isLoggedIn = req.isAuthenticated();
        next();
    });

    app.get('/', function(req, res) {
        res.render('index', { 
            title: 'HTML5 Shooter',
            user: req.user
        });
    });

    app.get('/login', function(req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/me');
        } else {
            res.render('login.hbs');
        }
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/me', isLoggedIn, function(req, res) {
        orm.models.User.findById(req.user.id).then(function(user) {
            user.getGames().then(function(games) {
                var games = games.map(function(game){ 
                    return game.toJSON() 
                });

                var goodGames = _.filter(games, function(game) { 
                    return game.score > 0 
                });

                res.render('user.hbs', {
                    title: req.user.name,
                    user: req.user,
                    games: games,
                    score: config.get('game.scoreMultiplier') * goodGames.length
                });
            });
        });
    });

    // app.get('/u/:id', isLoggedIn, function(req, res, next) {
    //     User.find({ where: { id: req.params.id } }).then(function(error, user) {
    //         if (!user) {
    //             next();
    //         }

    //         res.render('user.hbs', {
    //             user : req.user // get the user out of session and pass to template
    //         });

    //         next();
    //     });
    // });

    // route for twitter authentication and login
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        successRedirect : '/me',
        failureRedirect : '/'
    }));

    // 404 handler
    app.use(function(req, res) {
        res.render('404.hbs', { title: 'Not found' });
    });
};
