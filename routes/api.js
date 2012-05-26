var service = require('../lib/');

module.exports = function(app) {

  function sendjson(res, nullstatus) {
    return function(err, data) {
      if(err) console.log(err && err.stack);
      if(err) return res.json(500, {msg: err.message});
      if(!data) {
        if(statusCode)
          return res.json(nullstatus || 200, {msg: http.STATUS_CODES[nullstatus]});
        else
          return res.send();
      } else {
        res.json({data: data});
      }
    }
  }

  function requireLogin(req, res, next) {
    if(!req.session.uid) {
      return res.json(403, {err: 'not login'});
    }
    next();
  }

  // jsonp
  app.get('/request_message', requireLogin, function(req, res, next) {
      // server will send cmd to client, let client do something
      // ipcount

      // cmd: msg , api
      //  让浏览器抓取某个用户的信息
  });

  app.get('/api/user', requireLogin, function(req, res, next) {
      var uid = req.session.uid;
      service.loadUser(uid, sendjson(res, 403));
  });

  app.get('/api/player', requireLogin, function(req, res, next) {
      var uid = req.session.uid;
      service.loadPlayer(uid, sendjson(res, 403));
  });

  app.get('/api/city/:id', requireLogin, function(req, res, next) {

  });

}
