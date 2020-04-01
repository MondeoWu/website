export default {
    publicApis: [/\/sign-up/, /\/login/, /\/_api/, /\/docs/, /\/oauth2/],
    passwordRegExp: /^[A-Z|a-z|0-9|_|-]{8,}$/,
    bcryptPrefixPhp: '$2y$',
    bcryptPrefixNode: '$2b$',
    oauth2: {
      hd: 'hdddd.com',
      consentRedirecttUrl: 'http://api-staging.canvasrecruit.com/v1/oauth2/consent-callback',
      tokenRedirectUrl: 'http://api-staging.canvasrecruit.com/v1/oauth2/token-callback',
      google: {
        configUrl: 'https://accounts.google.com/.well-known/openid-configuration',
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        infoUrl: 'https://openidconnect.googleapis.com/v1/userinfo',
        clientId: '479598600971-8s8mkprq6f4s15qefqiq9nop4rlr5btr.apps.googleusercontent.com',
        clientSecret: '0ZQLUjDK9UmpeoFoCIz6-F5j'
      }
    }
}