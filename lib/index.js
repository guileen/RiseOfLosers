var World = require('./world')
  , Player = require('./player')
  , User = require('./user')
  ;

var world = new World();

exports.getWorld = function() {
  return world;
}

exports.User = User;
exports.Player = Player;
