/* eslint-disable class-methods-use-this */

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const config = require('../config/config');
const logger = require('../config/logger');

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
            const apiKey = auth === null ? config.mailgun.apiKey : auth.apiKey;
            const domain = auth === null ? config.mailgun.domain : auth.domain;
            const sender = from === null ? config.systemEmail : from;
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
            logger.error(err);
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
            const apiKey = auth === null ? config.mailgun.apiKey : auth.apiKey;
            const domain = auth === null ? config.mailgun.domain : auth.domain;
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
            logger.error(err);
            return false;
        }
    }
}

module.exports = EmailHelper;
