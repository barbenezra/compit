const config = require('./config');
const mcache = require('./cache');
const auth = require ('./auth');
const eventLog = require('./eventLog');

module.exports = (app) => {
    // Geocoding - address to coordinates
    app.get('/geocode', function (req, res) {
        if (!req.query.address) {
            res.status(400).send('You must provide an address an parameter');
        } else {
            const reqUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${req.query.address}&key=${config.api_key}`;

            mcache.get(reqUrl)
                .then(function (response) {
                    res.send(response.data.results[0].geometry.location);
                })
                .catch(function (error) {
                    res.status(500).send(error);
                });
        }
    });

    // Get nearby wikipedia information
    app.get('/wikinearby', function (req, res) {
        if (!req.query.lat || !req.query.lon) {
            res.status(400).send('You must provide a longitude and latitude as parameters');
        } else {
            const reqUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=coordinates|pageimages|pageterms&colimit=50&piprop=thumbnail&pithumbsize=144&pilimit=50&wbptterms=description&generator=geosearch&ggscoord=${req.query.lat}|${req.query.lon}&ggsradius=10000&ggslimit=50&format=json`;

            mcache.get(reqUrl)
                .then(function (response) {
                    const nearbyLocations = Object.values(response.data.query.pages).map(location => {
                        const { title, thumbnail, coordinates } = location;

                        return Object.assign(
                            { title, coordinates: { lat: coordinates[0].lat, lon: coordinates[0].lon } },
                            thumbnail ? { thumbnailUrl: thumbnail.source } : undefined
                        );
                    })

                    res.send(nearbyLocations);
                })
                .catch(function (error) {
                    res.status(500).send(error);
                });
        }
    });

    // Sends the event log
    app.get('/usage', auth, function(req, res){
        res.send(eventLog);
    });
}