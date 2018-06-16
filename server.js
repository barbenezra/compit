const express = require('express');
const config = require('./config');
const eventLog = require('./eventLog');
const port = process.env.PORTs || config.port;

// Set express
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Event sourcing
app.use(function (req, res, next) {
    const { ip, hostname, url, originalUrl } = req;
    
    eventLog.push({ ip, hostname, url: originalUrl || url });
    next();
})

// Set api routes
require('./routes')(app);

// Create the http server
app.listen(port, () => {
    console.log(`Express listening on port ${port} on environment ${process.env.NODE_ENV}`);
});