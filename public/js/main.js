!function(){
  var app = this.app || (this.app = {});

  app.clients = [];
  var rest = app.rest = new RestClient();

  app.login = function(results) {

  }

  app.loginState = function(callback) {
    rest.post('/loginState', function(err, data) {
        app.login(data);
    })
  }

  app.logout = function() {

  }

  app.loginWithOA2 = function(results) {
    // get user information
  }

  app.bindOA2 = function(results) {

    var type = results.type;
    var clz = social[type];
    var api = new clz(results);
    app.clients.push(api);
  }

}()
