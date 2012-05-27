var redisClient = require('../config').redisClient
  , User = require('./user')
  , myconsole = require('myconsole')
  , gamedata = require('../data/gamedata')

  , PLAYER_ = 'player:'
  ;

function serializePlayer(player) {
  return JSON.stringify(player);
}

function deserializePlayer(playerStr) {
  return JSON.parse(playerStr);
}

exports.createPlayer = function(user, callback) {
  var player = {
      id: user.id
    , name: user.username
    , avatar: user.avatar
    , node: 42
    , city: gamedata.nodes['42'].cityId
    , money: 5000
    , exp: 0
    , level: 1
    , reputation: 0
    , moral: 100
  };
  exports.save(player, callback);
}

// load player data in redis
exports.loadPlayer = function(uid, callback) {

  exports.get(uid, function(err, player) {
      if(err || player) return callback(err, player);

      // create player if not created.
      User.loadUser(uid, function(err, user) {
          if(err) {return callback(err);}
          if(!user) return callback(new Error('no such user ' + uid));

          exports.createPlayer(user, function(err, data) {
              if(err) {return callback(err);}

              exports.get(uid, callback);
          })
      })
  });
}

exports.movePlayer = function(uid, to, callback) {
  exports.get(uid, function(err, player) {
      if(err) {return callback(err);}
      exports.update(player, {
          node: to
        , from: player.node
        , to: to
        , city: gamedata.nodes[to].cityId
      }, callback)
  })
}

exports.get = function(uid, callback) {
  redisClient.get(PLAYER_ + uid, function(err, playerStr) {
      if(err) {return callback(err);}
      callback(null, playerStr && deserializePlayer(playerStr));
  });
}

exports.save = function(player, callback) {
  var key = PLAYER_ + player.id;
  redisClient.set(key, serializePlayer(player), function(err, data) {
      if(err) {return callback(err);}
      callback(null, player);
  });
}

exports.update = function(player, obj, callback) {

  for(var name in obj) {
    player[name] = obj[name];
  }

  exports.save(player, callback);
}

exports.updateById = function(uid, obj, callback) {
  var key = PLAYER_ + uid;

  redisClient.get(key, function(err, player) {
      if(err) {return callback(err);}
      exports.update(player, obj, callback);
  })
}

