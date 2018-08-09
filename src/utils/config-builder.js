var fs = require('fs');

var ConfigBuilder = {
    build : function () {
        var configJson = JSON.parse(fs.readFileSync('../config.json', 'utf8'));

        if(process.env.NODE_ENV === 'production') {
            return configJson.production;
        } else {
            return configJson.development;
        }
    }
};

module.exports = ConfigBuilder;