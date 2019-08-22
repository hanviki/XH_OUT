'use strict';

module.exports = () => {
  return async (ctx, next) => {
    if (!ctx.session.user) {
      throw new ctx.app.errors.NotLogin('尚未登录，请先登录');
    }

    await next();
  };
};
