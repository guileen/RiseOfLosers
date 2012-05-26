var service = require('../lib/')
  , gamedata = require('../data/gamedata')
  ;

var clientdata;

function initClientJSON() {
  var cities = {}
    , goods = {}
    , nodes = {}
    ;

  for(var id in gamedata.cities) {
    var city = gamedata.cities[id];
    cities[id] = {
      id: city.id
    , name: city.name
    , nodes: []
    }
  }

  for(var id in gamedata.nodes) {
    var node = gamedata.nodes[id];
    var city = cities[node.cityId];
    var clientNode = nodes[id] = {
      id: node.id
    , name: node.name
    }
    city.nodes.push(clientNode);
  }

  for(var id in gamedata.goods) {
    var good = gamedata.goods[id];
    goods[id] = {
      id: good.id
    , name: good.name
    }
  }

  clientdata = {
    cities : cities
  , goods : goods
  , nodes : nodes
  }
}

initClientJSON();

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

  app.get('/api/clientdata', requireLogin, function(req, res, next) {
      res.json(clientdata);
  })

  app.get('/api/city/:id', requireLogin, function(req, res, next) {
      res.json(clientdata.cities[req.params.id])
  })

  app.get('/api/goods/mget', requireLogin, function(req, res, next) {
      var results = [];
      var ids = req.query.ids;
      ids.split(',').forEach(function(id){
          results.push(clientdata.goods[id]);
      });
      res.json(results);
  })

  app.get('/api/good/:id', requireLogin, function(req, res, next) {
      res.json(clientdata.goods[req.params.id]);
  })

}
