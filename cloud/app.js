// Express
var express = require('express');
var app = express();

// Modules
var authentication = require('cloud/authentication/module.js');
var push = require('cloud/push/module.js');

var modules = [authentication, push];

// Configuration and module initialisation
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

for (var i = 0; i < modules.length; i++) {
	modules[i].init(app, express);
};

// Routes
app.get('/', function(req, res) {
    var user = Parse.User.current();
    if (user) {
        user.fetch().then(function(fetchedUser) {
            res.render('dashboard', { username: fetchedUser.getUsername() });
        });
    } else {
        res.render('home');
    }
});

for (var i = 0; i < modules.length; i++) {
	modules[i].registerRoutes(app);
};

app.use(function(req, res) {
    res.render('404');
});

app.listen();
