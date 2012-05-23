var exports = module.exports = {
  redis: {
    host: 'localhost'
  , port: 6379
  }
, oauth2: {
    sina: {
      key: ''
    , secret: ''
    , base: 'https://api.weibo.com'
    , authorizePath: '/oauth2/authorize'
    , accessTokenPath: '/oauth2/access_token'
    }
  , qq: {
      key: ''
    , secret: ''
    , base: ''
    , authorizePath: ''
    }
  }
}
