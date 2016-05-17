/**
* Studiengang: MultimediaTechnology / FHS
* Zweck: Web (Basisqualifikationen)
* Autor: Erfan Ebrahimnia
*/

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {

        name: DataTypes.STRING,

        email: DataTypes.STRING,

        description: DataTypes.STRING,

        twitterId: DataTypes.STRING,

        twitterAccessToken: DataTypes.STRING,

        avatar: DataTypes.STRING

    }, {
        classMethods: {
            associate: function(models) {
                User.hasMany(models.Game, { as: 'Games' });
            }
        }
    });

    return User;
};
