var config = require('../config')
  , redisClient = config.redisClient
  , crypto = require('crypto')
  , World = require('./world')
  , myconsole = require('myconsole')
  ;

var SNS_ = 'sns:' // oid:sina_123  oid:qq_123
  , USER_ = 'user:'
  , PLAYER_ = 'player:'
  , USERNAME_ = 'username:'

  , _USER = ':uid' // 

  , SEQ_USER = 'seq:user'
  ;

/**
 * schemes
 *
 * H oid:{oid}        {user info}
 * H oid:{oid}:token  {oa2 results}
 * V oid:{oid}:uid    uid
 *
 * Z uid:{uid}:oids   {oid: , score: date ...}
 *
 */

exports.loadUserByOA2 = function(oid, results, callback) {

}

exports.bindOIDtoUID = function(oid, uid, callback) {

}

exports.loadUser = function(uid, callback) {
  redisClient.hgetall(USER_ + uid, function(err, data) {
      if(data) {
        delete data.password;
      }
      callback(err, data);
  });
}

var md5 = function(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

exports.existsUser = function(username, callback) {
  var key = USER_ + username;
  redisClient.exists(key, callback);
}

/**
 * user:
 *    username:
 *    password:  md5(password)
 *
 */
exports.createUser = function(user, callback) {
  if(!user.username) return callback(new Error('username is required'));
  redisClient.incr(SEQ_USER, function(err, uid) {
      if(err) {return callback(err);}

      var key = USER_ + uid;
      user.id = uid;
      redisClient.exists(key, function(err, ex) {
          if(err || ex) return callback(err || new Error('User ' + user.username + ' exists'));
          user.password = md5(user.password);
          redisClient.multi()
            .hmset(key, user)
            .set(USERNAME_ + user.username + _USER, uid)
            .exec(callback);

          exports.createPlayer(user);
      })
  })
}

exports.checkUserAuth = function(username, password, callback) {
  redisClient.get(USERNAME_ + username + _USER, function(err, uid) {
      if(err) {return next(err);}
      redisClient.hget(USER_ + uid, 'password', function(err, data){
          callback(err, data == md5(password) ? uid : null);
      });
  })
}

exports.createPlayer = function(user, callback) {
  var uid = user.id;
  redisClient.hmset(PLAYER_ + uid, {
      id: uid
    , name: user.username
    , avatar: user.avatar
    , pos: 1
    , money: 5000
    , exp: 0
    , level: 1
    , reputation: 0
    , moral: 100
  }, myconsole.ifError);
}

// load player
exports.loadPlayer = function(uid, callback) {
  redisClient.hgetall(PLAYER_ + uid, function(err, player) {
      if(err) {return callback(err);}
      if(player) return callback(null, player);

      // create player if not created.
      redisClient.hgetall(USER_ + uid, function(err, user) {
          if(err) {return callback(err);}
          if(!user) return callback(new Error('no such user'));

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
          pos: to
        , from: player.pos
        , to: to
      }, callback)
  })
}

exports.updatePlayer = function(player, callback) {

}

var world = new World();

exports.getWorld = function() {
  return world;
}
