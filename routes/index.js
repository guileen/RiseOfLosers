var OAuth2 = require('oauth').OAuth2
  , config = require('../config')
  , qs = require('querystring')
  , service = require('../lib/')
  // , weibo = require('../lib/weibo')
  , User = service.User
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
          console.log(results);
          weibo.getUser(access_token, results.uid, console.ifError)
          results.type = type;
          res.end('<script>var oa2token = ' + JSON.stringify(results) + '</script><script src="/js/loadtoken.js"></script>')
      })
  });

  app.post('/signup', function(req, res, next) {
      var user = req.body;
      if(user.password != user['repeat-password']) {
        res.redirect('/login.html');
      }
      delete user['repeat-password'];
      User.createUser(user, function(err, uid) {
          if(err) {return next(err);}
          req.session.uid = uid;
          res.redirect('/');
      });
  });

  app.get('/logout', function(req, res, next) {
      req.session.destroy(function(){
          res.redirect('/');
      })
  })

  app.post('/login', function(req, res, next) {
      User.checkUserAuth(req.body.username, req.body.password, function(err, uid) {
          if(err) {return next(err);}
          if(uid !== null) {
            req.session.uid = uid;
            res.redirect('/');
          } else {
            res.redirect('/login.html');
          }
      })
  });

  require('./api')(app);
}
