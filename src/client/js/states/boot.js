'use strict';

function Boot() {}

Boot.prototype.create = function() {
    //The maximum number of Pointers allowed to be active at any one time
    this.game.input.maxPointers = 1;

    // dont‘t pause game on focusout
    this.game.stage.disableVisibilityChange = true;

    this.game.state.start('preloader');
};

module.exports = Boot;
