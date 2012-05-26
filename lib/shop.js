var gamedata = require('../data/gamedata');

var goods = gamedata.goods;
var allgoods = [];
for(var id in goods) {
  allgoods.push(id);
}

/**
 * every shop goods information should save to database
 *
 */
var Shop = module.exports = function(data){
  this.data = data;
  this.init();
}

Shop.prototype = {

  init: function() {
    var data = this.data;
    if(!data.goods) {
      this.refreash();
    }
  }

, buy: function(player, itemId, count, callback) {

  }

, sell: function(player, itemId, count, price, callback) {

  }

, refreash: function() {
    var useGoods = randomArr(allgoods, 3);
    var goods = this.data.goods = {};
    useGoods.forEach(function(goodId) {
        var goodInfo = gamedata.goods[goodId];
        goods[goodId] = goodInfo.min + (goodInfo.max - goodInfo.min) * Math.random();
    })
  }

, getSellingGoods: function() {
    return this.data.goods;
  }

  // to string ?
, serialize: function() {

  }

}

// arr
function randomArr(arr, count) {
  if(arr.length <= count) {
    return arr.slice();
  }

  var result = []
  while(result.length < count) {
    var index = Math.floor(Math.random() * arr.length);
    var value = arr[index];
    if(result.indexOf(value) < 0) {
      result.push(value);
    }
  }
  return result;
}
