'use strict';

const { USER_ROLE } = require('../lib/constant');

module.exports = () => {
  return async (ctx, next) => {
    if (ctx.session.user.role !== USER_ROLE.DECIDER) {
      throw new ctx.app.errors.Unauthorized('您无权限进行此操作');
    }

    await next();
  };
};
