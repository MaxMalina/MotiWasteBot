var fs = require('fs');

var ConfigBuilder = {
    build : function (env) {
        var configJson = JSON.parse(fs.readFileSync('/root/MotiWasteBot/src/config.json', 'utf8'));
        if(env === 'production') {
            return configJson.production;
        } else {
            return configJson.development;
        }
    }
};

module.exports = ConfigBuilder;
