var mod = {};

mod.init = function(app, express) {};

mod.registerRoutes = function(app) {
	app.get('/push', this.handlers.get.push);
	app.post('/push', this.handlers.post.push);
}

mod.handlers = {
	get: {
		push: function(req, res) {
			res.render('push/dulfy');
		}
	},
	post: {
		push: function(req, res) {
			if (!req.body.message) {
				return res.render('push/dulfy', { error: 'Please enter a message' });
			}

			var payload = {
				channels: ['global'],
				data: {
					alert: req.body.message,
					sound: 'default',
					badge: 'increment'
				}
			};
			if (req.body.url) {
				payload.data.action = 'dulfy';
				payload.data.url = req.body.url;
			}

			Parse.Push.send(payload, {
				success: function() {
					res.render('push/dulfy', { success: 'Push notification sent successfully!' });
				},
				error: function(error) {
					res.render('push/dulfy', { error: error.message });
				}
			});
		}
	}
};

module.exports = mod;
