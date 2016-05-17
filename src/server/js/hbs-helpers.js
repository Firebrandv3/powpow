var moment = require('moment');

module.exports = {
    datefmt: function(date, format) { 
        return moment(date).format(format);
    }
};
