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
  this.data = data || {};
  this.cities = {};
  this.init();
}

World.prototype = {

  init: function() {
    var data = this.data;
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

, getCities : function(callback) {
    return this.cities;
  }

, refreash: function() {

  }

}
