const cache = require('memory-cache');
const axios = require('axios');

get = (url) => {
    const res = cache.get(url);

    if (!res){
        return axios.get(url)
            .then(function(response){
                cache.put(url, response);
                return response;
            });
    }
    
    return new Promise(function(resolve, reject){
        resolve(res)
    });
}

purge = () => {
    cache.clear();
}

module.exports = { get, purge }