var fs = require('fs');

// In your app.js, include a route handler for all other routes (*) to go to error404.
// app.get('*', error.error404);
exports.error404 = function(req, res) {
    if (req.accepts('html')) {
        // Respond with html page.
        fs.readFile(__dirname + '/../../public/404/index.html', 'utf-8', function(err, page) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.write(page);
            res.end();
        });
    }
    else if (req.accepts('json')) {
        // Respond with json.
        res.status(404).send({ error: 'Not found' });
    }
    else {
        // Default to plain-text. send()
        res.status(404).type('txt').send('Not found');
    }
};