'use strict';

const Controller = require('egg-fortress').Controller;
const { USER_ROLE } = require('../lib/constant');
const { APPLICATION_STATE, APPLICATION_LEVEL, REVIEW_STATE } = require('../lib/constant');

class UserController extends Controller {
  async getSMSCode() {
    const { ctx } = this;
    const { app, service, helper } = ctx;

    const errors = app.validator.validate({
      jobNum: { type: 'string', required: true, allowEmpty: false },
    }, ctx.request.body);

    if (errors) {
      throw new app.errors.InvalidParam(`${errors[0].field} ${errors[0].message}`);
    }

    const { jobNum } = ctx.request.body;

    const user = await service.user.findOne({ jobNum });

    if (!user || !user.mobile) {
      throw new app.errors.InvalidParam('输入的工号不存在');
    }

    const code = helper.generateRandomCode();
    const expire = helper.moment().add(5, 'm');

    ctx.session.sms = {
      code,
      expire: expire.valueOf(),
    };

    const to = user.mobile;
    const content = `您的验证码是：${code}，5分钟内有效，请勿泄漏。如非本人操作，请忽略此信息。`;

    const result = await service.sms.send({
      to,
      content,
      expire: expire.utc().format('YYYY-MM-DD HH:mm:ss'),
    });

    if (result.out !== '0') {
      throw new app.errors.SendSMS('验证码发送失败');
    }

    this.ctx.success();
  }

  async login() {
    const { ctx } = this;
    // const { app, service, session } = ctx;
    const { app, service } = ctx;

    const errors = app.validator.validate({
      jobNum: { type: 'string', required: true, allowEmpty: false },
      password: { type: 'string', required: true, allowEmpty: false },
      // smsCode: { type: 'int', min: 1000, max: 9999, required: true, allowEmpty: false },
    }, ctx.request.body);

    if (errors) {
      throw new app.errors.InvalidParam(`${errors[0].field} ${errors[0].message}`);
    }

    // const { jobNum, password, smsCode } = ctx.request.body;
    const { jobNum, password } = ctx.request.body;

    // if (!session.sms || session.sms.code !== smsCode || Date.now > session.sms.expire) {
    //   throw new app.errors.InvalidParam('验证码输入错误');
    // }

    const user = await service.user.findOne({
      jobNum,
      password: password.toUpperCase(),
    });

    if (!user) {
      throw new app.errors.InvalidParam('工号或密码错误');
    }

    ctx.session.user = user;

    ctx.success();
  }

  async logout() {
    this.ctx.session = null;
    this.ctx.success();
  }

  async getCurrentUser() {
    console.log("getCurrentUser");
    this.ctx.success(this.ctx.session.user);
  }

  async getApplicationList() {
    const user = this.ctx.session.user;

    if (user.role === USER_ROLE.NORMAL) {
      await this.getUserApplicationList();
    }

    if (USER_ROLE.REVIEWER.indexOf(user.role) > -1) {
      await this.getReviewerApplicationList();
    }

    if (user.role === USER_ROLE.DECIDER) {
      await this.getDeciderApplicationList();
    }
  }

  async getUserApplicationList() {
    const ctx = this.ctx;
    const { service, helper } = ctx;
    const userId = ctx.session.user.id;

    const applications = await service.application.find({
      applicantId: userId,
    });

    const reviews = helper._.groupBy(await service.review.findByApplicationIds(helper._.map(applications, 'id')), 'applicationId');

    helper._.forEach(applications || [], record => {
      record.reviews = reviews[record.id] || [];
    });

    ctx.success({
      applications,
    });
  }

  async getReviewerApplicationList() {
    const ctx = this.ctx;
    const { service, app, helper } = ctx;

    const errors = app.validator.validate({
      limit: { type: 'int', min: 1, max: 50, required: false },
      page: { type: 'int', required: false },
      // mobile: { type: 'string', required: false, allowEmpty: true },
      query: { type: 'string', required: false, allowEmpty: true },
      state: { type: 'enum', values: helper._.values(APPLICATION_STATE), required: false },
      reviewState: { type: 'enum', values: helper._.values(REVIEW_STATE), required: false },
      level: { type: 'enum', values: helper._.values(APPLICATION_LEVEL), required: false },
    }, ctx.request.body);

    if (errors) {
      throw new app.errors.InvalidParam(`${errors[0].field} ${errors[0].message}`);
    }

    const userId = ctx.session.user.id;
    const { page = 1, limit = 10, query, reviewState, level, state } = ctx.request.body;

    const innerQuery = build => {
      build
        .where('tbl_application.state', '<>', APPLICATION_STATE.UNSUBMIT)
        .andWhere('tbl_application.state', '<>', APPLICATION_STATE.RE_SUBMIT)

      if (query) {
        build.andWhere(build => {
          build
            .where('tbl_application.applicantJobNum', 'like', `%${query}%`)
            .orWhere('tbl_application.applicantName', 'like', `%${query}%`);
        });
      }

      if (state) {
        build.andWhere('tbl_application.state', state);
      }

      if (reviewState !== undefined) {
        build.andWhere('tbl_review.reviewState', reviewState);
      }

      if (level) {
        build.andWhere('tbl_application.level', level);
      }
    };

    const [ applications, total ] = await Promise.all([
      service.application.findByReviewerWithPage(userId, innerQuery, { page, limit }),
      service.application.countByReviewerWithPage(userId, innerQuery),
    ]);

    ctx.success({
      page,
      limit,
      total,
      applications,
    });
  }

  async getDeciderApplicationList() {
    const ctx = this.ctx;
    const { service, app, helper } = ctx;

    const errors = app.validator.validate({
      limit: { type: 'int', min: 1, max: 50, required: false },
      page: { type: 'int', required: false },
      // mobile: { type: 'string', required: false, allowEmpty: true },
      query: { type: 'string', required: false, allowEmpty: true },
      state: { type: 'enum', values: helper._.values(APPLICATION_STATE), required: false },
      level: { type: 'enum', values: helper._.values(APPLICATION_LEVEL), required: false },
    }, ctx.request.body);

    if (errors) {
      throw new app.errors.InvalidParam(`${errors[0].field} ${errors[0].message}`);
    }

    const { page = 1, limit = 10, state, level, query } = ctx.request.body;

    const innerQuery = build => {
      build
        .where('state', '<>', APPLICATION_STATE.UNSUBMIT);

      if (query) {
        build.andWhere(build => {
          build
            .where('applicantJobNum', 'like', `%${query}%`)
            .orWhere('applicantName', 'like', `%${query}%`);
        });
      }

      if (state) {
        build.andWhere('state', state);
      }

      if (level) {
        build.andWhere('level', level);
      }
    };

    const [ applications, total ] = await Promise.all([
      service.application.findByPage(innerQuery, { page, limit }),
      service.application.countByQuery(innerQuery),
    ]);

    const reviews = helper._.groupBy(await service.review.findByApplicationIds(helper._.map(applications, 'id')), 'applicationId');

    helper._.forEach(applications || [], record => {
      record.reviews = reviews[record.id] || [];
    });

    ctx.success({
      page,
      limit,
      total,
      applications,
    });
  }

  async getOwnerList() {
    const ctx = this.ctx;
    const { service } = ctx;
    const owners = await service.user.findOwners();
    ctx.success({
      owners,
    });
  }
}

module.exports = UserController;
