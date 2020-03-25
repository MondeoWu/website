import {ClientResponse} from "@sendgrid/client/src/response"
import sgMail from '@sendgrid/mail'
import log from '../config/log'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

async function sendMail(from: string, to: string, subject: string, text: string, html: string): Promise<[ClientResponse, {}]> {
  try {
    return await sgMail.send({ from, to, subject, text, html });
  } catch (err) {
    log.error(err.toString());
  }
}