var config = require('../config')
  , redisClient = config.redisClient
  , crypto = require('crypto')
  ;

var md5 = function(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

var USER_ = 'user:'
  , USERNAME_ = 'username:'
  , OUSER_ = 'ouser:'
  , _USER = ':uid' //
  , SEQ_USER = 'seq:user'

exports.loadUser = function(uid, callback) {
  redisClient.hgetall(USER_ + uid, function(err, data) {
      if(data) {
        delete data.password;
      }
      callback(err, data);
  });
}

exports.loadUserByOUser = function(ouser, callback) {
  redisClient.hgetall(OUSER_ + ouser.oid, function(err, ouser) {
      if(err) {return next(err);}
      // TODO FIXME
  })
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
            .exec(function(err, data) {
              if(err) return callback(err);
              callback(null, uid);
            });
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

