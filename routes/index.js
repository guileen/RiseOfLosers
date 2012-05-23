var OAuth2 = require('oauth').OAuth2
  , config = require('../config')
  , qs = require('querystring')
  ;

module.exports = function(app) {

  function getOA2(type) {
    var appinfo = config.oauth2[type];
    return new OAuth2(appinfo.key, appinfo.secret, appinfo.base, appinfo.authorizePath, appinfo.accessTokenPath)
  }

  app.get('/login/oauth2', function(req, res, next) {
      var type = req.querystring;
      var oa2 = getOA2(type);
      res.redirect(oa2.getAuthorizeUrl({redirect_uri: req.fulluri('/login/oauth2/code?type=' + type) , response_type: 'code'}))
  });

  app.get('/login/oauth2/code', function(req, res, next) {
      var query = req.query;
      var type = query.type;
      var code = query.code;
      var oa2 = getOA2(type);
      console.log(code)
      oa2.getOAuthAccessToken(code, {redirect_uri: req.fulluri('/login/oauth2/code?type=' + type)}, function(err, access_token, refresh_token, results) {
          if(err) {return next(err);}
          results.type = type;
          res.end('<script>var oa2token = ' + JSON.stringify(results) + '</script><script src="/js/loadtoken.js"></script>')
      })
  })

  // jsonp
  app.get('/request_message', function(req, res, next) {
      // server will send cmd to client, let client do something
      // ipcount

      // cmd: msg , api
      //  让浏览器抓取某个用户的信息
  })

  // features
  // Who is unfollowed you?
}
