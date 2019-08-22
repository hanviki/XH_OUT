'use strict';
module.exports = appInfo => {
  const config = exports = {};
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + 'J8RSDn3azSNbt2al';
  // add your config here
  config.middleware = [ 'notfoundHandler' ];
  config.knex = {
    client: {
      debug: true,
      dialect: 'mysql2',
      connection: {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '123456',
        database: 'declare',
        typeCast: (field, next) => {
          if (field.type === 'DATETIME') {
            return new Date(field.string() + 'Z');
          }
          return next();
        },
      },
      pool: { min: 0, max: 20 },
      acquireConnectionTimeout: 30000,
    },
    app: true,
    agent: false,
  };
  config.session = {
    key: 'sess',
    maxAge: 24 * 3600 * 1000, // 1 天
    httpOnly: true,
    encrypt: true,
  };
  config.redis = {
    client: {
      host: 'localhost',
      port: '6379',
      password: '',
      db: '1',
    },
    agent: true,
  };
  config.view = {
    mapping: {
      '.ejs': 'ejs',
    },
  };
  config.ejs = {};
  // 自定义error类型
  config.errors = [{
    name: 'InvalidParam',
    code: 101,
    status: 200,
  }, {
    name: 'MysqlInsert',
    code: 102,
    status: 500,
  }, {
    name: 'SendSMS',
    code: 103,
    status: 500,
  }, {
    name: 'NotLogin',
    code: 104,
    status: 200,
  }, {
    name: 'Unauthorized',
    code: 105,
    status: 200,
  }];
  config.accepts = ctx => {
    if (ctx.request.path.startsWith(`${config.pathPrefix || ''}/api`)) {
      return 'json';
    }
    return 'html';
  };
  config.onerror = {
    accepts: config.accepts,
  };
  config.SMS_SERVICE_URL = 'http://119.97.220.235:8288/sms_service/services/smsService?wsdl';
  config.security = {
    csrf: {
      enable: false,
    },
  };
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };
  config.multipart = {
    whitelist: [ '.pdf' ],
    fileSize: '50mb',
  };
  config.enableSMS = false;
  config.pageVisitToken = 'w7NnucnTXfe7dikJ';
  config.logger = {
    level: 'DEBUG',
  };
  return config;
};
