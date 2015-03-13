// Express
var express = require('express');
var app = express();

// Modules
var authentication = require('cloud/authentication/module.js');

// Configuration and module initialisation
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body
authentication.init(app, express);

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

authentication.registerRoutes(app);

app.use(function(req, res) {
    res.render('404');
});

app.listen();
