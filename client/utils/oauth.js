import facebook_oauth from './../../server/assets/facebook_oauth.json';

export function getFacebookRedirectLink(redirect_url, state) {
  return 'https://www.facebook.com/v12.0/dialog/oauth?'
    + `client_id=${facebook_oauth.app_id}`
    + `&redirect_uri=${redirect_url}`
    + (state ? `&state=${state}` : '')
    + `&scope=public_profile email`
  // + `&response_type=granted_scopes`; use to show list of granted scopes
}