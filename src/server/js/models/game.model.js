/**
* Studiengang: MultimediaTechnology / FHS
* Zweck: Web (Basisqualifikationen)
* Autor: Erfan Ebrahimnia
*/

module.exports = function(sequelize, DataTypes) {
    var Game = sequelize.define('Game', {

        nick: {
            type: DataTypes.STRING,

            defaultValue: 'Anon'
        },

        score: DataTypes.INTEGER

    }, {
        classMethods: {
            associate: function(models) {
                // Game.belongsTo(models.User);
            }
        }
    });

    return Game;
};
