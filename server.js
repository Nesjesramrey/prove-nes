const express = require('express');
var path = require('path');
//puerto de escucha
const port = process.env.PORT ||4040;
//const compression = require('compression')

//Starting Express app
const app = express();
//app.use(compression())

//Set the base path to the angular-test dist folder
app.use(express.static(path.join(__dirname, 'dist/app-frontend')));

//Any routes will be redirected to the angular app
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist/app-frontend/index.html'));
});

//Starting server on port 4040
app.listen(port, () => {
    console.log('Server started!');
    console.log('on port', port);
});