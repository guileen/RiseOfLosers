var gamedata = require('../data/gamedata');
var City = require('./city');

/**
 *
 * the data of world
 *
 * data : {
 *    cities: {}
 * }
 *
 */
var World = module.exports = function(data) {
  this.cities = {};
  this.init();
}

World.prototype = {

  init: function(data) {
    this.data = data || (data = {});
    this.cities = {};
    var cities = data.cities || (data.cities = {});
    for(var cid in gamedata.cities) {
      var city = cities[cid] || (cities[cid] = {id: cid});
      this.cities[city.id] = new City(city);
    }
  }

, getPlayer : function(pid, callback) {

  }

, getCity: function(cityId) {
    return this.cities[cityId];
  }

, getNode: function(nodeId) {
    var cityId = gamedata.nodes[nodeId].cityId;
    return this.getCity(cityId).getNode(nodeId);
  }

, getCities : function(callback) {
    return this.cities;
  }

, refreash: function() {

  }

}
