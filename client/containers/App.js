import React, { useEffect, useState } from 'react';

import facebook_oauth from './../../server/assets/facebook_oauth.json';

export default function App(props) {
  const [hasSession, setHasSession] = useState(false);

  /*
  useEffect(() => {
    // attempt to load app state
    fetch()
  }, []);
  */

  return (
    <>
      {hasSession && <h2>User has a session!</h2>}
      <a href={getFacebookRedirectLink(
        facebook_oauth.app_id,
        'https://localhost:8080/login/facebook',
        JSON.stringify({ message: 'hello world' })
      )}>Login Facebook</a>
      <img src="https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=4283744385006083&height=100&width=100&ext=1635463572&hash=AeTfY7SinoOq6UiQAB8" />
    </>
  );
}

// TODO remove to utils 
function getFacebookRedirectLink(app_id, redirect_url, state) {
  return 'https://www.facebook.com/v12.0/dialog/oauth?'
    + `client_id=${app_id}`
    + `&redirect_uri=${redirect_url}`
    + `&state=${state}`
    + `&scope=public_profile email`
  // + `&response_type=granted_scopes`; use to show list of granted scopes
}
