'use strict';

module.exports = () => {
  return async (ctx, next) => {
    await next();

    if (ctx.status === 404 && !ctx.body) {
      if (ctx.app.config.accepts(ctx) === 'json') {
        ctx.status = 404;
        ctx.body = 'not found';
      } else {
        ctx.body = 'not found';
      }
    }
  };
};
