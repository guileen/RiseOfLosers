var exports = module.exports = {
  redis: {
    host: 'localhost'
  , port: 6379
  , db: 0
  }
, oauth2: {
    sina: {
      key: '1442984732'
    , secret: '77a125c3c40258297359214e9e2362d0'
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
