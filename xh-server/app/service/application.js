'use strict';

const Service = require('egg-fortress').Service;
const { APPLICATION_STAGE, APPLICATION_STATE, REVIEW_STATE, SECOND_VIEWER_ROLE, THIRD_VIEWER_ROLE } = require('../lib/constant');

class ApplicationService extends Service {
  constructor(ctx) {
    super(ctx);
    this.tableName = 'tbl_application';
    this.columns = [
      'id',
      'applicantId',
      'applicantJobNum',
      'applicantName',
      'applicantMobile',
      'applicantGender',
      'applicantBirthday',
      'applicantProWork',
      'applicantHiredate',
      'deptName',
      'declarationYear',
      'applyTime',
      'major',
      'intro',
      'state',
      'level',
      'groupAdvice',
      'groupName',
      'updatedAt',
      'createdAt',
      'lxzy',
      'ywmc',
      'xxlr',
      'xxgh',
      'lxgj',
      'lxxx',
      'xxpm',
      'zypm',
      'dsxm',
      'xsrz',
      'xzzw',
      'dsyq',
      'dsjj',
      'tjjs',
      'hymczw',
      'hymcyw',
      'hykssj',
      'hyjssj',
      'hyzbf',
      'hydd',
      'hyjj',
      'hyzx',
      'hyzxzx',
      'hyzcr',
      'hybg',
      'hylr',
      'dddz',
      'dzsj',
      'zygjc',
      'ylkh',
      'lxkssj',
      'lxjssj',
      'grjj',
      'cjjj',
      'lxfx',
      'khzb',
      'bysj',
      'zycj',
      'zyzw',
      'ksfzr', // 科室负责人，第一阶段评审人
      'stage',
      'dsxzzw',
      'lxfx',
      'xxlr',
      'khzb',
      'hymczw',
      'hymcyw',
      'hykssj',
      'hyjssj',
      'hyzbf',
      'hydd',
      'hyjj',
      'hyzx',
      'hyzxzx',
      'hyzcr',
      'hybg',
      'hylr',
      'school',
      'education',
      'xxzhpm',
      'xxjjpm',
      'yyxz',
      'yypm',
      'yyjjpm',
      'zyxgx',
      'zyzhpm',
      'dsjq',
      'dsqr',
      'dswjys',
      'dsys',
      'dszx',
      'zyfg',
      'zyzj',
      'zychj',
      'zy8n',
      'zy5n',
      'xkzd',
      'xklczd',
      'xksjzd',
      'score',
      'section'
    ];
    this.shortColumns = [ `${this.tableName}.id`, 'applicantId', 'applicantJobNum', 'applicantName', 'applyTime', `${this.tableName}.state`, 'level', `${this.tableName}.updatedAt`, `${this.tableName}.createdAt`, 'groupAdvice', 'groupName', 'ksfzr', `${this.tableName}.stage` ];
    this.reviewTableName = 'tbl_review';
    this.reviewColumns = [ `${this.reviewTableName}.reviewState`, 'reviewTime', 'reviewAdvice', `${this.reviewTableName}.isRejected`, `${this.reviewTableName}.rejectReason`, `${this.reviewTableName}.rejectedBy`, `${this.reviewTableName}.stage` ];
  }

  async exitsById(id) {
    return await this.exitsByQuery({ id });
  }

  async exitsByQuery(query) {
    const { app } = this.ctx;

    const result = await app.knex(this.tableName)
      .select('id')
      .first()
      .where(query);

    return !!result;
  }

  async find(query) {
    const { app } = this.ctx;

    const result = await app.knex(this.tableName)
      .select(this.shortColumns)
      .where(query);

    return result;
  }

  async findOne(query) {
    const { app } = this.ctx;

    const result = await app.knex(this.tableName)
      .select(this.columns)
      .first()
      .where(query);

    return result;
  }

  async countByQuery(query) {
    const { app } = this.ctx;

    const result = await app.knex(this.tableName)
      .count({ total: 'id' })
      .where(query);

    return result[0] && result[0].total;
  }

  async findByReviewerWithPage(userId, query = {}, page) {
    const { app } = this.ctx;

    const records = await app.knex(this.tableName)
      .innerJoin(this.reviewTableName, function() {
        this.on(`tbl_application.id`, `tbl_review.applicationId`)
        this.on(`tbl_application.stage`, '>=', `tbl_review.stage`)
      })
      .select(this.shortColumns.concat(this.reviewColumns))
      .where(`${this.reviewTableName}.reviewerId`, userId)
      .andWhere(query)
      // .andWhere(`tbl_application.stage`, '>=', `tbl_review.stage`)
      .offset((page.page - 1) * page.limit)
      .limit(page.limit)
      .orderBy(`${this.tableName}.updatedAt`, 'DESC');

    return records;
  }

  async countByReviewerWithPage(userId, query = {}) {
    const { app } = this.ctx;

    const result = await app.knex(this.tableName)
      .innerJoin(this.reviewTableName, `${this.tableName}.id`, `${this.reviewTableName}.applicationId`)
      .count({ total: `${this.tableName}.id` })
      .where(`${this.reviewTableName}.reviewerId`, userId)
      .andWhere(query);

    return result[0] && result[0].total;
  }

  async findByPage(query, page) {
    const { app } = this.ctx;

    const records = await app.knex(this.tableName)
      .select(this.shortColumns)
      .where(query)
      .offset((page.page - 1) * page.limit)
      .limit(page.limit)
      .orderBy('updatedAt', 'DESC');

    return records;
  }

  async addOne(record) {
    const { app } = this.ctx;

    const [ id ] = await app.knex
      .insert(record, 'id')
      .into(this.tableName);

    return { id };
  }

  async updateOne(query, record) {
    const { app } = this.ctx;

    const id = await app.knex(this.tableName)
      .where(query)
      .update(record, 'id');

    return id;
  }

  async reject(id) {
    const { app } = this.ctx;

    const trx = await app.knex.transaction();

    try {
      await app.knex(this.tableName)
        .where({ id })
        .update({ state: APPLICATION_STATE.RE_SUBMIT, stage: APPLICATION_STAGE.STAGE_0 }, 'id')
        .transacting(trx);

      await app.knex(this.reviewTableName)
        .where({ applicationId: id })
        .del()
        .transacting(trx);

      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw error;
    }

    return id;
  }

  async rejectByReviewer(id, reviewerId, groupName, advice) {
    const { app, helper } = this.ctx;

    const trx = await app.knex.transaction();
    const application = await this.findOne({id})

    try {

      if (application.stage <= 2){
        await app.knex(this.tableName)
          .where({ id })
          .update({ state: APPLICATION_STATE.RE_SUBMIT, groupAdvice: advice, groupName, stage: APPLICATION_STAGE.STAGE_0 }, 'id');
      }

      await app.knex(this.reviewTableName)
        .where({ applicationId: id, reviewerId })
        .update({
          reviewState: REVIEW_STATE.REJECT,
          reviewAdvice: advice,
          isRejected: false,
          rejectReason: null,
          rejectedBy: null,
          reviewTime: helper.moment().utc().format('YYYY-MM-DD HH:mm:ss'),
        }, 'id')
        .transacting(trx);

      const hasUnReviewed = await app.knex(this.reviewTableName)
        .select('id')
        .first()
        .where({ applicationId: id })
        .andWhere('reviewState', REVIEW_STATE.UNREVIEW)
        .transacting(trx);

      if (!hasUnReviewed) {
        await app.knex(this.tableName)
          .where({ id })
          .update({
            state: APPLICATION_STATE.REVIEW_PASSED,
            stage: APPLICATION_STAGE.STAGE_4,
          }, 'id')
          .transacting(trx);
      }

      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw error;
    }

    return id;
  }

  async rejectByDecider(id, groupName, advice) {
    const { app } = this.ctx;

    await app.knex(this.tableName)
      .where({ id })
      .update({ state: APPLICATION_STATE.RE_SUBMIT, groupAdvice: advice, groupName, stage: APPLICATION_STAGE.STAGE_0 }, 'id');

    return id;
  }

  async submit(id, oldState) {
    const { app, service, helper } = this.ctx;

    const application = await this.findOne({id})
    const trx = await app.knex.transaction();
    try {
      await app.knex(this.tableName)
        .where({ id })
        .update({
          state: oldState === APPLICATION_STATE.UNSUBMIT ? APPLICATION_STATE.REVIEWING : APPLICATION_STATE.RE_REVIEWING,
          stage: APPLICATION_STAGE.STAGE_1,
          groupAdvice: null,
          groupName: null,
        }, 'id')
        .transacting(trx);

      if (oldState === APPLICATION_STATE.UNSUBMIT) {
        const reviewers = await service.user.findReviewers(application);
        if (reviewers && reviewers.length > 0) {
          await app.knex
            .insert(helper._.map(reviewers, record => {
              return {
                applicationId: id,
                reviewerId: record.id,
                reviewerName: record.name,
                stage: service.user.getReviewerStage(application, record),
              };
            }), 'id')
            .into(this.reviewTableName)
            .transacting(trx);
        }
      } else {
        await app.knex(this.reviewTableName)
          .where({ applicationId: id })
          .update({
            reviewState: REVIEW_STATE.UNREVIEW,
            reviewAdvice: null,
            isRejected: false,
            rejectReason: null,
            rejectedBy: null,
            reviewTime: null,
          }, 'id')
          .transacting(trx);
      }

      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw error;
    }

    return id;
  }

  async reviewPass(applicationId, userId, advice, values) {
    const { app, helper } = this.ctx;

    const trx = await app.knex.transaction();

    try {
      const applicaiton = await this.findOne({ id: applicationId })
      await app.knex(this.reviewTableName)
        .where({ applicationId, reviewerId: userId })
        .update({
          reviewState: REVIEW_STATE.PASSED,
          reviewAdvice: advice,
          isRejected: false,
          rejectReason: null,
          rejectedBy: null,
          reviewTime: helper.moment().utc().format('YYYY-MM-DD HH:mm:ss'),
          sfxj: values.sfxj || 0,
          sfcj: values.sfcj || 0,
          sftj: values.sftj || 0,
          ywcyj1: values.ywcyj1 || '',
          ywcyj2: values.ywcyj2 || '',
          ywcyj3: values.ywcyj3 || '',
          ywcyj4: values.ywcyj4 || '',
          ywcyj5: values.ywcyj5 || '',
          pzkssj: values.pzkssj || '',
          pzjssj: values.pzjssj || '',
        })
        .transacting(trx);

      if (applicaiton.stage === APPLICATION_STAGE.STAGE_1) {
        await app.knex(this.tableName)
          .where({ id: applicationId })
          .update({
            stage: APPLICATION_STAGE.STAGE_2,
          }, 'id')
          .transacting(trx);
      } else if (applicaiton.stage === APPLICATION_STAGE.STAGE_2) {
        await app.knex(this.tableName)
          .where({ id: applicationId })
          .update({
            stage: APPLICATION_STAGE.STAGE_3,
          }, 'id')
          .transacting(trx);
      }

      const hasUnReviewed = await app.knex(this.reviewTableName)
        .select('id')
        .first()
        .where({ applicationId })
        .andWhere('reviewState', REVIEW_STATE.UNREVIEW)
        .transacting(trx);

      if (!hasUnReviewed) {
        await app.knex(this.tableName)
          .where({ id: applicationId })
          .update({
            state: APPLICATION_STATE.REVIEW_PASSED,
            stage: APPLICATION_STAGE.STAGE_4,
          }, 'id')
          .transacting(trx);
      }

      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw error;
    }

    return applicationId;
  }

  async rejectReview(id, reviewerId,  applicationId, rejectedBy, reason) {
    const { app, service } = this.ctx;

    const trx = await app.knex.transaction();

    try {
      const application = await app.knex(this.tableName)
        .select(this.shortColumns)
        .first()
        .where({ id: applicationId })
        .transacting(trx);

      const user = await service.user.findOne({id: reviewerId})

      if (application.state === APPLICATION_STATE.PASSED) {
        throw new app.errors.InvalidParam('审核已经通过，不能再进行驳回操作');
      }

      const stage = service.user.getReviewerStage(application, user)
      this.ctx.logger.info("aaaaaaaaaaaaaaaaaaaaa")
      this.ctx.logger.info(stage)
      this.ctx.logger.info(application.stage)
      if (application.stage > stage) {
        await app.knex(this.tableName)
          .where({ id: applicationId })
          .update({
            state: APPLICATION_STATE.RE_REVIEWING,
            stage: stage,
          }, 'id')
          .transacting(trx);

        await app.knex(this.reviewTableName)
          .where({ applicationId: applicationId })
          .where('stage', '>', stage)
          .update({
            isRejected: false,
            rejectReason: reason,
            rejectedBy,
            reviewAdvice: null,
            reviewState: REVIEW_STATE.UNREVIEW,
            reviewTime: null,
          })
          .transacting(trx);
      }else {
        if (application.state === APPLICATION_STATE.REVIEW_PASSED){
          await app.knex(this.tableName)
            .where({ id: applicationId })
            .update({
              state: APPLICATION_STATE.RE_REVIEWING,
            }, 'id')
            .transacting(trx);
        }
      }

      await app.knex(this.reviewTableName)
        .where({ id })
        .update({
          isRejected: true,
          rejectReason: reason,
          rejectedBy,
          reviewAdvice: null,
          reviewState: REVIEW_STATE.UNREVIEW,
          reviewTime: null,
        })
        .transacting(trx);

      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw error;
    }

    return id;
  }
}

module.exports = ApplicationService;
