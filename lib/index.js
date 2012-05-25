var config = require('../config')
  , redisClient = config.redisClient
  ;

var OID_ = 'oid:' // oid:sina_123  oid:qq_123
  , UID_ = 'uid:'

  , _UID = ':uid' // 
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

exports.loadPlayer = function(uid, callback) {

}

exports.updatePlayer = function(player, callback) {

}
