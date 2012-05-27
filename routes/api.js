var service = require('../lib/')
  , http = require('http')
  , gamedata = require('../data/gamedata')
  , User = service.User
  , Player = service.Player
  ;

var clientdata;

function initClientJSON() {
  var cities = {}
    , goods = {}
    , nodes = {}
    , allgoods = []
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

  for(var id in goods) {
    allgoods.push(goods[id]);
  }
  clientdata = {
    cities : cities
  , goods : goods
  , nodes : nodes
  , allgoods : allgoods
  }
}

initClientJSON();

module.exports = function(app) {

  function sendjson(res, nullstatus) {
    return function(err, data) {
      if(err) {
        console.log(err && err.stack);
        return res.json(500, {msg: err.message});
      }
      if(!data) {
        if(nullstatus)
          return res.json(nullstatus || 200, {msg: http.STATUS_CODES[nullstatus]});
        else
          return res.send();
      } else {
        res.json(data);
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
      // 让浏览器抓取某个用户的信息
      //
      // what happend
  });

  app.get('/api/logout', function(req, res, next) {
      req.session.destroy(function(){
          res.json({success: true});
      })
  })

  app.post('/api/login', function(req, res, next) {
      User.checkUserAuth(req.body.username, req.body.password, function(err, uid) {
          if(err) {return res.json(500, {err : err.message});}
          if(uid !== null) {
            req.session.uid = uid;
            User.loadUser(uid, sendjson(res, 403));
          } else {
            res.json(403, {err: 'not login'});
          }
      })
  });

  app.get('/api/user', requireLogin, function(req, res, next) {
      var uid = req.session.uid;
      User.loadUser(uid, sendjson(res, 403));
  });

  app.get('/api/player', requireLogin, function(req, res, next) {
      var uid = req.session.uid;
      Player.loadPlayer(uid, sendjson(res, 403));
  });

  app.get('/api/clientdata', requireLogin, function(req, res, next) {
      res.json(clientdata);
  });

  app.get('/api/city/:id', requireLogin, function(req, res, next) {
      res.json(clientdata.cities[req.params.id])
  });

  app.get('/api/goods/mget', requireLogin, function(req, res, next) {
      var ids = req.query.ids;
      if(ids == 'all') {
        res.json(clientdata.allgoods);
      } else {
        var results = [];
        ids.split(',').forEach(function(id){
            results.push(clientdata.goods[id]);
        });
        res.json(results);
      }
  });

  app.get('/api/good/:id', requireLogin, function(req, res, next) {
      res.json(clientdata.goods[req.params.id]);
  });

  // ?detail=1
  app.get('/api/node/:id/goods', requireLogin, function(req, res, next) {
      var uid = req.session.uid;
      var nodeId = req.params.id;
      Player.loadPlayer(uid, function(err, player) {
          if(err) {return callback(err);}

          if(player.node != nodeId) {
            // TODO user friend is there
            return res.json(403, {err: 'not allowed'});
          }

          var cityId = gamedata.nodes[nodeId].cityId;
          var detail = req.query.detail == '1';
          var nodeObj = service.getWorld().getCity(cityId).getNode(nodeId)
          var selling = nodeObj.getSellingGoods();
          if(detail) {
            var results = {};
            for(var id in selling) {
              var good = clientdata.goods[id];
              results[id] = {
                id: id
              , name: good.name
              , price: selling[id]
              }
            }
            res.json(results);
          } else {
            res.json(selling);
          }

      })
  });

  app.get('/api/goto/:id', requireLogin, function(req, res, next) {
      var uid = req.session.uid;
      Player.movePlayer(uid, req.params.id, function(err, data) {
          if(err) {return res.json(500, {err: err.message});}
          res.json({events: []})
      })
  });

  app.post('/api/buy', requireLogin, function(req, res, next) {
      var uid = req.session.uid
        , itemId = req.body.item
        , count = req.body.count
        ;
      Player.loadPlayer(uid, function(err, player) {
          if(err) {return next(err);}
          var shop = service.getWorld().getNode(player.node);
          shop.playerBuy(player, itemId, count, sendjson(res, 403));
      })
  })

  app.post('/api/sell', requireLogin, function(req, res, next) {
      var uid = req.session.uid
        , itemId = req.body.item
        , count = req.body.count
        ;

      Player.loadPlayer(uid, function(err, player) {
          if(err) {return next(err);}
          var shop = service.getWorld().getNode(player.node);
          shop.playerSell(player, itemId, count, sendjson(res, 403));
      })
  })

}
