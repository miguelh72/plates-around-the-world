function getFacebookAccessTokenUrl(redirect_url, app_id, app_secret, code) {
  return 'https://graph.facebook.com/v12.0/oauth/access_token?'
    + `redirect_uri=${redirect_url}`
    + `&client_id=${app_id}`
    + `&client_secret=${app_secret}`
    + `&code=${code}`;
}

function getFacebookUserInfoUrl(access_token) {
  return 'https://graph.facebook.com/v12.0/me?'
    + 'fields=id%2Cname%2Cemail%2Cfirst_name%2Clast_name%2Cpicture.type(large)'
    + `&access_token=${access_token}`;
}

module.exports = { getFacebookAccessTokenUrl, getFacebookUserInfoUrl };
