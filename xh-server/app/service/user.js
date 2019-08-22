'use strict';

const Service = require('egg-fortress').Service;
const { USER_ROLE, VIEWER_ROLE, SECOND_VIEWER_ROLE, THIRD_VIEWER_ROLE, APPLICATION_STAGE } = require('../lib/constant');

class UserService extends Service {
  constructor(ctx) {
    super(ctx);
    this.tableName = 'tbl_user';
    this.columns = [
      'id',
      'jobNum',
      'name',
      'deptDesc',
      'position',
      'hrId',
      'gender',
      'birthday',
      'workerGroup',
      'idCard',
      'idType',
      'title',
      'education',
      'school',
      'birthplace',
      'nation',
      'politics',
      'hiredate',
      'workdate',
      'proWork',
      'mobile',
      'role',
      'createdAt',
      'bysj',
      'ksfzrxm',
      'ksfzrgh',
    ];
  }

  async findOne(query) {
    const { app } = this.ctx;

    const result = await app.knex(this.tableName)
      .select(this.columns)
      .first()
      .where(query);

    return result;
  }

  async find(query) {
    const { app } = this.ctx;

    const results = await app.knex(this.tableName)
      .select(this.columns)
      .where(query);

    return results;
  }

  async findReviewers(application) {
    const { app } = this.ctx;

    const roles = VIEWER_ROLE[application.level];

    const results = await app.knex(this.tableName)
      .select(this.columns)
      .whereIn('role', roles)
      .orWhereIn('id', [ application.ksfzr]);

    return results;
  }

  async findFirstReviewers(application) {
    const { app } = this.ctx;

    const results = await app.knex(this.tableName)
      .select(this.columns)
      .WhereIn('id', [ application.ksfzr]);

    return results;
  }

  async findSecondReviewers(application) {
    const { app } = this.ctx;

    const roles = SECOND_VIEWER_ROLE[application.level];

    const results = await app.knex(this.tableName)
      .select(this.columns)
      .whereIn('role', roles)

    return results;
  }

  async findThirdReviewers(application) {
    const { app } = this.ctx;

    const roles = THIRD_VIEWER_ROLE[application.level];

    const results = await app.knex(this.tableName)
      .select(this.columns)
      .whereIn('role', roles)

    return results;
  }

  getReviewerStage(application, user){
    if (application.ksfzr === user.id.toString()){
      return APPLICATION_STAGE.STAGE_1;
    }

    if (SECOND_VIEWER_ROLE[application.level].indexOf(user.role) >= 0){
      return APPLICATION_STAGE.STAGE_2;
    }

    if (THIRD_VIEWER_ROLE[application.level].indexOf(user.role) >= 0){
      return APPLICATION_STAGE.STAGE_3;
    }

    return APPLICATION_STAGE.STAGE_3;
  }

  async findOwners() {
    const { app } = this.ctx;

    const results = await app.knex(this.tableName)
      .select(this.columns)
      .whereIn('role', USER_ROLE.OWNER);

    return results;
  }
}

module.exports = UserService;
