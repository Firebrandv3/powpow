/**
* Studiengang: MultimediaTechnology / FHS
* Zweck: Web (Basisqualifikationen)
* Autor: Erfan Ebrahimnia
*/

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

function modelsToJSON(models) {
    return models.map(function(model){ 
        return model.toJSON();
    });
}

function getUserPageData(user, games) {
    var preparedGames = modelsToJSON(games);

    return {
        title: user.name,
        user: user,
        games: preparedGames
    };
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

    app.get('/imprint', function(req, res) {
        res.render('simple.hbs', { title: 'Imprint' });
    });

    app.get('/login', function(req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/me');
        } else {
            res.render('login.hbs', { title: 'Login' });
        }
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/me', isLoggedIn, function(req, res) {
        orm.models.User.findById(req.user.id).then(function(user) {
            user.getGames({ 
                limit: 10,
                order: [['createdAt', 'DESC']]
            }).then(function(games) {
                res.render('user.hbs', getUserPageData(user, games));
            });
        });
    });

    app.get('/u/:id', function(req, res, next) {
        orm.models.User.findById(req.params.id).then(function(user) {
            if (!user) {
                res.redirect('/not-found');
            }

            user.getGames({ 
                limit: 10,
                order: [['createdAt', 'DESC']]
            }).then(function(games) {
                res.render('user.hbs', getUserPageData(user, games));
            });
        });
    });

    app.get('/highscore', function(req, res, next) {
        orm.models.User.findAll({
            limit: 100,
            order: [['score', 'DESC']],
        }).then(function(users) {
            res.render('highscore.hbs', {
                title: 'Highscore',
                users: modelsToJSON(users)
            });
        });
    });

    // route for twitter authentication and login
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        successRedirect : '/me',
        failureRedirect : '/'
    }));

    app.get('/not-found', function(req, res) {
        res.render('404.hbs', { title: '404 Not found!' });
    });

    // 404 handler
    app.use(function(req, res) {
        res.render('404.hbs', { title: '404 Not found!' });
    });
};
