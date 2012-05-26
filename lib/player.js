var redisClient = require('../config').redisClient
  , User = require('./user')
  , myconsole = require('myconsole')

  , PLAYER_ = 'player:'
  ;

exports.createPlayer = function(user, callback) {
  var uid = user.id;
  redisClient.hmset(PLAYER_ + uid, {
      id: uid
    , name: user.username
    , avatar: user.avatar
    , node: 1
    , money: 5000
    , exp: 0
    , level: 1
    , reputation: 0
    , moral: 100
  }, callback || myconsole.ifError);
}

exports.loadPlayer = function(uid, callback) {
  redisClient.loadPlayerData(uid, function(err, player) {
      if(err) {return callback(err);}
      var playerObj = new Player(player);
      callback(null, playerObj);
  });
}

// load player data in redis
exports.loadPlayerData = function(uid, callback) {
  redisClient.hgetall(PLAYER_ + uid, function(err, player) {
      if(err) {return callback(err);}
      if(player) return callback(null, player);

      // create player if not created.
      User.loadUser(uid, function(err, user) {
          if(err) {return callback(err);}
          if(!user) return callback(new Error('no such user ' + uid));

          exports.createPlayer(user, function(err, data) {
              if(err) {return callback(err);}
              redisClient.hgetall(PLAYER_ + uid, callback);
          })
      })
  });
}

exports.movePlayer = function(uid, to, callback) {
  var key = PLAYER_ + uid;
  redisClient.hgetall(key, function(err, player) {
      if(err) {return next(err);}
      redisClient.hmset(key, {
          node: to
        , from: player.node
        , to: to
      }, callback)
  })
}

exports.updatePlayer = function(player, callback) {

}

