var World = require('../lib/world')
  , util = require('util');

describe('test', function() {
    var world = new World();
    console.log(util.inspect(world.data, false, 10));
})
