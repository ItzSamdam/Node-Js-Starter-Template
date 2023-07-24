/* eslint-disable class-methods-use-this */

import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { mailgun as _mailgun, systemEmail } from '../config/config';
import { error } from '../config/logger';

class EmailHelper {

    /**
     * Set Value
     * @param {String} from
     * @param {String} to
     * @param {String} subject
     * @param body
     * @param auth
     * @param {Boolean} attachment
     * @returns {String/Boolean}
     */
    async sendEmail(from, to, subject, body, auth = null, attachment = false) {
        try {
            const apiKey = auth === null ? _mailgun.apiKey : auth.apiKey;
            const domain = auth === null ? _mailgun.domain : auth.domain;
            const sender = from === null ? systemEmail : from;
            const mailgun = new Mailgun(formData);
            const client = mailgun.client({
                username: 'api',
                key: apiKey,
            });
            let postData = {
                from: sender,
                to,
                subject,
                html: body,
            };
            if (attachment) {
                postData = {
                    ...postData,
                    attachment,
                };
            }
            return !!(await client.messages.create(domain, postData));
        } catch (err) {
            console.log(err);
            error(err);
            return false;
        }
    }

    /**
     * Set Value
     * @param {String} from
     * @param {String} to
     * @param {String} subject
     * @param text
     * @param body
     * @param auth
     * @param {Boolean} attachment
     * @returns {String/Boolean}
     */
    async sendEmailWithAttachment(from, to, subject, text, body, attachment, auth = null) {
        try {
            const apiKey = auth === null ? _mailgun.apiKey : auth.apiKey;
            const domain = auth === null ? _mailgun.domain : auth.domain;
            const mailgun = new Mailgun(formData);
            const attachments = [attachment];
            const client = mailgun.client({
                username: 'api',
                key: apiKey,
            });

            const postData = {
                from,
                to,
                subject,
                text,
                html: body,
                attachments,
            };

            return !!(await client.messages.create(domain, postData));
        } catch (err) {
            error(err);
            return false;
        }
    }
}

export default EmailHelper;
