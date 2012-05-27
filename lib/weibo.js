var OAuth2 = require('oauth').OAuth2
  , config = require('../config')
  , request = require('request').defaults({jar: false, followRedirect: false})
  , baseURI = 'https://api.weibo.com/2'
  ;

var appinfo = config.oauth2.sina;

function transform(user) {
  console.log(user);
  return {
    screen_name: user.screen_name
  , avatar: user.profile_image_url
  , oid: user.id
  , type: 'weibo'
  }
}

exports.getUser = function(access_token, oid, callback) {
  request.get({url: baseURI + '/users/show.json', qs: {source:appinfo.key, access_token: access_token, uid: oid}}, function(err, res, body) {
      if(err) {return callback(err);}
      var user = JSON.parse(body);
      user = transform(user);
      callback(null, user);
  })
}
