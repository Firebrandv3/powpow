var config = require('config');

var instance;

function UpdateManager() {
    this.listeners = [];
}

UpdateManager.prototype.start = function() {
    // init mainloop
    setInterval(this.mainLoop.bind(this), 1000 / config.get('game.mainLoopUpdateRate'));
};

UpdateManager.prototype.subscribe = function(listener) {
    this.listeners.push(listener);
};

UpdateManager.prototype.mainLoop = function() {
    var listener;
    
    for (var i = 0; i < this.listeners.length; i++) {
        listener = this.listeners[i];

        if (!!listener) {
            listener.call(this);
        }
    }
};

module.exports.getInstance = function() {
    if (!instance) {
        instance = new UpdateManager();
    }

    return instance;
}
