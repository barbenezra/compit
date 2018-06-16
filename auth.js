const auth = require('http-auth');

// Configure basic auth
const basic = auth.basic({
    realm: 'SUPER SECRET STUFF'
}, function (username, password, callback) {
    callback(username == 'admin' && password == 'Aa123456');
});

// Create middleware that can be used to protect routes with basic auth
module.exports = auth.connect(basic);