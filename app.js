// init config at very first
var config = require('./config')
  , redis = require('redis')
  ;

var redisClient = config.redisClient = redis.createClient(config.redis.port, config.redis.host);
redisClient.select(config.redis.db || 0);

/**
 * Module dependencies
 */
var kick = require('kick')
  , connect = require('connect')
  , http = require('http')
  , myconsole = require('myconsole')
  , RedisStore = require('connect-redis')(connect)
  , app = kick()
  , PORT = process.env.PORT || 3000
  ;

myconsole.useColors = true;
myconsole.replace();


app.configure('development', function() {
    app.use(connect.logger())
    // app.use(require('connect-less')({ src: __dirname + '/public/', compress: false }));
});

app
  .use(connect.favicon())
  .use(connect.static(__dirname + '/public'))
  .use(connect.cookieParser('keyboard cat'))
  .use(connect.bodyParser())
  .use(connect.session({ secret: "keyboard cat", store: new RedisStore }))

require('./routes')(app);

http.createServer(app).listen(PORT)
console.log('server running at %d', PORT)
