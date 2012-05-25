/**
 *
 * Base class for all persistentable class, like Player
 *
 * this.id is the id.
 *
 * this.data is the data to persistent to database
 *
 * this.dataset is the name of table for sql, collection name for mongodb, or key prefix for redis
 *
 */
var Sync = module.exports = function () {
}

Sync.prototype = {

  save: function(callback) {

  }

}
