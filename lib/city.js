var gamedata = require('../data/gamedata')
  , Shop = require('./shop')
  , Bank = require('./bank')
  ;

// init city.nodes
var nodes = gamedata.nodes;
var cities = gamedata.cities;
for(var id in nodes) {
  var node = nodes[id];
  var city = cities[node.cityId];
  (city.nodes || (city.nodes = [])).push(id);
}

/**
 * data is save in database
 *
 */
var City = module.exports = function(data) {
  this.data = data;
  data.nodes = data.nodes || {};
  this.nodes = {};
  this.id = data.id;
  this.init();
}

City.prototype = {

  init: function() {
    var data = this.data;
    var nodes = gamedata.cities[this.id].nodes;
    // load all nodes for city, if not exists in data, init it.
    for(var i in nodes) {
      var nodeId = nodes[i];
      var node = data.nodes[nodeId] || (data.nodes[nodeId] = {id: nodeId});
      var nodeObj;
      switch(node.type) {
        case 'bank':
        nodeObj = new Bank(node);
        break;

        case 'shop':
        default:
        nodeObj = new Shop(node)
      }
      this.nodes[nodeId] = nodeObj;
    }
  }

, refreash: function() {

  }

, getNodes: function() {
    return this.nodes;
  }

, getNode: function(id) {
    return this.nodes[id];
  }

}
