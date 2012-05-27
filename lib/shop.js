var gamedata = require('../data/gamedata')
  , Player = require('./player')
  ;

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

, playerBuy: function(player, itemId, count, callback) {
    count = parseInt(count);
    var goods = this.data.goods;
    var price = goods[itemId];
    if(price === undefined) {
      return callback(err);
    }
    var totalCost = price * count;

    if(player.money < totalCost) {
      return callback(new Error('not enough money'));
    }
    var items = player.items || (player.items = {});
    items[itemId] = (items[itemId] || 0) + count;

    player.money -= totalCost;

    Player.save(player, callback);
  }

, playerSell: function(player, itemId, count, callback) {
    count = parseInt(count);
    var goods = this.data.goods;
    var price = goods[itemId];
    if(price === undefined) {
      // you can only sell the items exists in current node
      return callback(err);
    }
    var totalGain = price * count;
    var items = player.items || (player.items = {});
    var hasItemCount = items[itemId] || 0;

    if(hasItemCount < count) {
      return callback(new Error('not enough items'));
    }
    items[itemId] = hasItemCount - count;

    player.money += totalGain;

    Player.save(player, callback);
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
