'use strict';

module.exports = () => {
  const config = exports = {};

  config.knex = {
    client: {
      dialect: 'mysql2',
      connection: {
        host: 'db',
        port: '3306',
        user: 'root',
        password: 'DYHGujh09RKyIdRR',
        database: 'xh',
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

  config.redis = {
    client: {
      host: 'redis',
      port: '6379',
      password: '',
      db: '1',
    },
    agent: true,
  };

  config.accepts = ctx => {
    if (ctx.request.path.startsWith(`${config.pathPrefix || ''}/api`)) {
      return 'json';
    }

    return 'html';
  };

  config.onerror = {
    accepts: config.accepts,
  };

  config.enableSMS = true;

  return config;
};
