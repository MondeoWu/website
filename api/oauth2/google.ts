import * as qs from 'qs'
import axios from 'axios'
import constant from '../config/constant'
import { v4 as uuidv4 } from 'uuid';
import Boom from 'boom';


export default class GoogleOauth2 {
  code: string
  tokenInfo: {[id: string] : string}

  constructor(code: string) {
    this.code = code
  }

  async getToken() {
    const data = qs.stringify({
      code: this.code,
      client_id: constant.oauth2.google.clientId,
      client_secret: constant.oauth2.google.clientSecret,
      redirect_uri: constant.oauth2.consentRedirecttUrl,
      grant_type: 'authorization_code'
    })

    try {
      const res = await axios({
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data,
        url: constant.oauth2.google.tokenUrl
      })
      this.tokenInfo = res.data
    } catch(e) {
      console.log(e.request)
      console.log(e.response.status)
      console.log(e.response.data)
      throw Boom.badRequest()
    }
  }

  async getUserInfo() {
    const res = await axios({
      method: 'GET',
      headers: { 'Authorization': `${this.tokenInfo.token_type} ${this.tokenInfo.access_token}` },
      url: constant.oauth2.google.infoUrl
    })
  }

  getSub(): string {
    console.log(this.tokenInfo)
    const payload = this.tokenInfo.id_token.split('.')[1]
    return JSON.parse(Buffer.from(payload, 'base64').toString('ascii')).sub
  }

  static consentUrl(): string {
    // TODO
    const scope = 'openid profile'
    const state = `security_token=${uuidv4()}`
    const nonce = '1111-1111'

    const args = {
      scope,
      state,
      // nonce,
      // response_type: 'code',
      response_type: 'token',  // easier
      client_id: constant.oauth2.google.clientId,
      redirect_uri: constant.oauth2.consentRedirecttUrl,
      hd: constant.oauth2.hd
    }

    return constant.oauth2.google.authUrl + '?' + qs.stringify(args)
  }
}