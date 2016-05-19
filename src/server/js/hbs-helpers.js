/**
* Studiengang: MultimediaTechnology / FHS
* Zweck: Web (Basisqualifikationen)
* Autor: Erfan Ebrahimnia
*/

var moment = require('moment');

module.exports = {
    datefmt: function(date, format) { 
        return moment(date).format(format);
    },

    counter: function(index) {
        return index + 1;
    }
};
