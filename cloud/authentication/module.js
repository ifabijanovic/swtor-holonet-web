var config = require('cloud/config/config.js');
var httpsRedirect = require('parse-express-https-redirect');
var cookieSession = require('parse-express-cookie-session');

var mod = {};

mod.init = function(app, express) {
	app.use(httpsRedirect());
	app.use(express.cookieParser(config.cookieSecret));
	app.use(cookieSession({ cookie: { maxAge: 3600000 }}));
};

mod.registerRoutes = function(app) {
	app.get('/login', this.handlers.get.login);
	app.post('/login', this.handlers.post.login);
	app.get('/logout', this.handlers.get.logout);
}

mod.handlers = {
	get: {
		login: function(req, res) {
		    res.render('authentication/login');
		},
		logout: function(req, res) {
		    Parse.User.logOut();
		    res.redirect('/');
		}
	},
	post: {
		login: function(req, res) {
		    if (!req.body.username) {
		        return res.render('authentication/login', { error: 'Please enter a username' });
		    } if (!req.body.password) {
		        return res.render('authentication/login', { error: 'Please enter a password' });
		    }

		    Parse.User.logIn(req.body.username, req.body.password).then(function() {
		        res.redirect('/');
		    }, function(error) {
		        res.render('authentication/login', { error: 'Invalid username or password' });
		    });
		}
	}
};

module.exports = mod;
