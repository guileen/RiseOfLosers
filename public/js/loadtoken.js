(function() {

var opener = window.opener;
if(!opener) {
  return location = '/';
}

opener.setOA2Token(oa2token);
window.close();

})();
