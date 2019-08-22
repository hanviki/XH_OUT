'use strict';

const Service = require('egg-fortress').Service;
const soap = require('soap');
const util = require('util');

class SMSService extends Service {
  constructor(ctx) {
    super(ctx);
    this.tableName = 'tbl_sms';
    this.columns = [ 'id', 'to', 'content', 'type', 'expire', 'createdAt' ];
  }

  async send({ to, content, expire = null, type = 1 }) {
    const { app } = this.ctx;
    const { config } = app;

    try {
      await app.knex
        .insert({
          to,
          content,
          expire,
          type,
        }, 'id')
        .into(this.tableName);
    } catch (error) {
      console.error(`insert sms to ${this.tableName} fail`, error);
    }

    let result = { out: '0' };

    if (config.enableSMS) {
      const url = config.SMS_SERVICE_URL;
      const client = await soap.createClientAsync(url);

      result = await util.promisify(client.service)({
        userName: 'XHAPPSMS',
        userPassword: '123XHAPP',
        userMAC: 'E8:4D:D0:C4:5A:FE',
        smsCode: 'fc',
        mobile: to,
        content,
      });
    }

    return result;
  }
}

module.exports = SMSService;
