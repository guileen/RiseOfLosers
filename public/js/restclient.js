!function($){
  /**
   *
   * var rest = new RestClient({
   *    params: {access_token: 'token', client_id: 'client_id'}
   *    , headers: {Accept: 'application/json'}
   *    , timeout: 30
   * });
   *
   * rest.post('/login', {user:'user', pass: 'pass'}, function(err, data, res) {
   *
   * });
   */


  /**
   *
   */
  var RestClient = this.RestClient = function RestClient(options) {
    // timeout: 3000
    // params: {}
    // headers: {}
    if(!options) {
      options = {};
    }
    if(typeof options == 'string') {
      options = {
        url: options
      }
    }

    options.url = options.url || '/';
    console.log(options.url);
    options.url[options.url.length - 1] != '/' && (options.url = options.url + '/');
    this.options = options;
  }

  RestClient.prototype = {

    request: function(method, url, params, callback){

      if(!callback && typeof params == 'function') {
        callback = params;
        params = undefined;
      }

      if(!url.match(/^https?:\/\/.*/)) {
        url[0] == '/' && (url = url.substring(1));
        url = this.options.url + url;
      }

      var options = this.options;
      $.extend(params, options.params);

      var data, headers = options.headers || {};

      $.ajax({
          url: url
        , type: method
        , data: params
        , headers: headers
        , timeout: options.timeout
        , success: function(data, textStatus, jqXHR) {
            callback && callback(null, data, toResponse(jqXHR, textStatus));
          }
        , error: function(jqXHR, textStatus, errorThrown) {
            callback && callback(errorThrown, null, toResponse(jqXHR, textStatus));
          }
      })

    }
  }

  $.each(['get', 'post', 'put', 'delete', 'head'], function(index, method) {
      RestClient.prototype[method] = function(url, params, callback){
        this.request(method, url, params, callback);
      }
  });

  RestClient.prototype.del = RestClient.prototype.delete;

  function toResponse(jqXHR, textStatus) {
    var headers = {};
    jqXHR.getAllResponseHeaders().split('\r\n').forEach(function(line){
        var kv = line.split(':', 2);
        headers[kv[0].toLowerCase()] = kv[1];
        headers[kv[0]] = kv[1];
    })
    return {
      statusCode: textStatus
    , headers: headers
    , xhr: jqXHR
    }
  }

}( window.jQuery )
